#pragma once
#include "esp_http_server.h"

#ifdef __cplusplus
extern "C" {
#endif

void      pair_log_append(const char *entry);
esp_err_t pair_log_serve(httpd_req_t *req);
esp_err_t pair_log_clear(httpd_req_t *req);

#ifdef __cplusplus
}
#endif
