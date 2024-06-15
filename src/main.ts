import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).use(createPinia()).mount("#app");

{
  const lightSchemeIcon = document.querySelector("link[href*=light]")!;
  const darkSchemeIcon = document.querySelector("link[href*=dark]")!;

  const matcher = matchMedia("(prefers-color-scheme: dark)");
  matcher.addEventListener("change", onMatcherChange);
  onMatcherChange();

  function onMatcherChange() {
    if (matcher.matches) {
      lightSchemeIcon.remove();
      document.head.appendChild(darkSchemeIcon);
    } else {
      darkSchemeIcon.remove();
      document.head.appendChild(lightSchemeIcon);
    }
  }
}
