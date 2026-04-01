/// <reference types="chrome"/>

window.addEventListener("message", (event) => {
  if (event.origin !== "https://localhost:5173") return;

  if (event.source !== window) return;

  if (event.data?.type === "LOCKENA_EXTENSION_LOGIN") {
    chrome.runtime.sendMessage({
      type: "STORE_SESSION",
      payload: event.data.payload,
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "AUTOFILL_CREDENTIALS") {
    const { login, password } = message.payload;

    const setNativeValue = (element: HTMLInputElement, value: string) => {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      if (valueSetter) {
        valueSetter.call(element, value);
      } else {
        element.value = value;
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const passwordInputs = Array.from(
      document.querySelectorAll('input[type="password"]'),
    ) as HTMLInputElement[];

    if (passwordInputs.length > 0) {
      // Берем первый видимый или просто первый инпут пароля
      const pwInput =
        passwordInputs.find((i) => i.offsetParent !== null) ||
        passwordInputs[0];
      setNativeValue(pwInput, password);

      let loginInputs: HTMLInputElement[] = [];
      const form = pwInput.closest("form");

      // Ищем поля текста/email
      if (form) {
        loginInputs = Array.from(
          form.querySelectorAll(
            'input[type="text"], input[type="email"], input[type="tel"]',
          ),
        ) as HTMLInputElement[];
      } else {
        const allInputs = Array.from(
          document.querySelectorAll('input:not([type="hidden"])'),
        ) as HTMLInputElement[];
        const pwIndex = allInputs.indexOf(pwInput);
        loginInputs = allInputs
          .slice(0, pwIndex)
          .filter(
            (i) => i.type === "text" || i.type === "email" || i.type === "tel",
          );
      }

      // Подставляем логин в ближайшее поле
      const loginInput = loginInputs[0];
      if (loginInput) setNativeValue(loginInput, login);
    }

    sendResponse({ type: "AUTOFILL_SUCCESS" });
  }
  return true;
});
