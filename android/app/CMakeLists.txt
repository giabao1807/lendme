cmake_minimum_required(VERSION 3.13)

project(appmodules)

add_library(appmodules SHARED
  ${CMAKE_CURRENT_SOURCE_DIR}/build/generated/autolinking/src/main/jni/autolinking.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp
)

target_link_libraries(appmodules
  fbjni
  jsi
  reactnative
  android
  log
  c++_shared
)
