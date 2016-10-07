export function DatePickerProvider() {
  let config = {};

  return {
    setConfig: function (userConfig) {
      config = userConfig;
    },
    $get: function () {
      return config;
    }
  };
}
