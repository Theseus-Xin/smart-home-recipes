import { createSSRApp } from "vue";
import {createPinia} from 'pinia';
import App from "./App.vue";
import { installNavigationGuards } from "./router/guards";

export function createApp() {
  const app = createSSRApp(App);

  app.use(createPinia());
  installNavigationGuards()
  
  return {
    app,
  };
}
