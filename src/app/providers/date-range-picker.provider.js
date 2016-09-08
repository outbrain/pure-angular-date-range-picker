export function DateRangePickerProvider() {
  let config;

  return {
    setConfig: function (userConfig) {
      config = userConfig;
    },
    $get: function () {
      return config;
    }
  };
}
