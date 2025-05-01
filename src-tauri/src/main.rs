// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mssql;
use mssql::execute_mssql_query;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![execute_mssql_query])   // Add this line to register the command
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
