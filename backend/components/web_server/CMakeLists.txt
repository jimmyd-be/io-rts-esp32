idf_component_register(
    SRCS "web_server.cpp" "syslog.cpp" "pair_log.cpp"
    INCLUDE_DIRS "include"
    REQUIRES app_config esp_http_server esp_netif esp_wifi joltwallet__littlefs espressif__cjson espressif__mqtt nvs_flash esp_driver_spi esp_driver_gpio mbedtls app_update esp_http_client json_streaming_parser2
)

set(PROJECT_BACKEND_DIR "${CMAKE_CURRENT_LIST_DIR}/../..")

# Access project headers without creating a circular component dependency
target_include_directories(__idf_web_server PRIVATE
    "${PROJECT_BACKEND_DIR}/main"
    "${PROJECT_BACKEND_DIR}/io-homecontrol"
    "${PROJECT_BACKEND_DIR}/io-homecontrol/protocol"
    "${PROJECT_BACKEND_DIR}/io-homecontrol/radio"
    "${PROJECT_BACKEND_DIR}/helpers"
    "${PROJECT_BACKEND_DIR}/config"
)
