#include "pair_log.h"
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <vector>
#include <string>
#include "esp_log.h"
#include "esp_http_server.h"

static const char *TAG = "pair_log";
static const char *LOG_PATH = "/devices/pairing_log.txt";
static const int   MAX_LINES = 500;

static std::string timestamp_str()
{
    time_t now = time(nullptr);
    if (now < 1000000000L) {
        // Clock not synced — use uptime
        char buf[32];
        snprintf(buf, sizeof(buf), "boot+%llds", (long long)now);
        return buf;
    }
    struct tm tm_info;
    gmtime_r(&now, &tm_info);
    char buf[24];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &tm_info);
    return buf;
}

void pair_log_append(const char *entry)
{
    if (!entry || !*entry) return;

    std::string line = timestamp_str() + " " + entry + "\n";

    // Count existing lines
    FILE *f = fopen(LOG_PATH, "r");
    int count = 0;
    std::vector<long> offsets; // byte offset of each line start
    if (f) {
        offsets.push_back(0);
        int c;
        while ((c = fgetc(f)) != EOF) {
            if (c == '\n') {
                count++;
                offsets.push_back(ftell(f));
            }
        }
        fclose(f);
    }

    if (count < MAX_LINES) {
        // Simple append
        f = fopen(LOG_PATH, "a");
        if (f) {
            fputs(line.c_str(), f);
            fclose(f);
        } else {
            ESP_LOGE(TAG, "Failed to open %s for append", LOG_PATH);
        }
        return;
    }

    // Need to trim: drop oldest lines so we have MAX_LINES-1, then append new one
    int drop = count - (MAX_LINES - 1);
    if (drop < 1) drop = 1;
    long keep_from = (drop < (int)offsets.size()) ? offsets[drop] : 0;

    f = fopen(LOG_PATH, "r");
    if (!f) {
        ESP_LOGE(TAG, "Failed to open %s for trim read", LOG_PATH);
        return;
    }
    fseek(f, keep_from, SEEK_SET);
    std::string kept;
    kept.reserve(MAX_LINES * 80);
    char buf[256];
    while (fgets(buf, sizeof(buf), f))
        kept += buf;
    fclose(f);

    kept += line;

    f = fopen(LOG_PATH, "w");
    if (f) {
        fputs(kept.c_str(), f);
        fclose(f);
    } else {
        ESP_LOGE(TAG, "Failed to open %s for trim write", LOG_PATH);
    }
}

esp_err_t pair_log_serve(httpd_req_t *req)
{
    httpd_resp_set_type(req, "text/plain");
    httpd_resp_set_hdr(req, "Content-Disposition", "attachment; filename=\"pairing_log.txt\"");

    FILE *f = fopen(LOG_PATH, "r");
    if (!f) {
        httpd_resp_sendstr(req, "");
        return ESP_OK;
    }

    char buf[256];
    while (fgets(buf, sizeof(buf), f))
        httpd_resp_sendstr_chunk(req, buf);
    fclose(f);
    httpd_resp_sendstr_chunk(req, nullptr); // end chunked response
    return ESP_OK;
}

esp_err_t pair_log_clear(httpd_req_t *req)
{
    remove(LOG_PATH);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_sendstr(req, "{\"status\":\"cleared\"}");
    return ESP_OK;
}
