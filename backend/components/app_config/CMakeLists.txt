idf_component_register(
    SRCS
        "${CMAKE_CURRENT_LIST_DIR}/../../config/SyslogConfig.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/../../helpers/NvsHelpers.cpp"
    INCLUDE_DIRS
        "${CMAKE_CURRENT_LIST_DIR}/../../config"
        "${CMAKE_CURRENT_LIST_DIR}/../../helpers"
    REQUIRES nvs_flash
)
