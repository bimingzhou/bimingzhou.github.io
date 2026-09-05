(function () {
  'use strict';

  var storageKey = 'bimingzhou-theme';
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  try {
    var saved = window.localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (error) {
    // The switch also works when browser storage is unavailable.
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (button) button.setAttribute('aria-checked', String(theme === 'dark'));
  }

  function applyPreference() {
    applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
  }

  // Apply the theme before the stylesheet loads to avoid a light flash.
  applyPreference();

  document.addEventListener('DOMContentLoaded', function () {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    applyPreference();
    button.hidden = false;
    button.addEventListener('click', function () {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(preference);
      try {
        window.localStorage.setItem(storageKey, preference);
      } catch (error) {
        // Keep the current choice for this page even without persistence.
      }
    });
  });

  systemTheme.addEventListener('change', function () {
    if (!preference) applyPreference();
  });

  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    applyPreference();
  });
}());
