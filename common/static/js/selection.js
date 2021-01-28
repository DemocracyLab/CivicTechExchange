/**
 * Initialize multi-selection box
 * @requires selectize.js (https://github.com/selectize/selectize.js/)
 *
 * @param selectElementId       Id of select element
 * @param config                Selectize configuration options
 */

function initializeSelectionControl(selectElementId, config) {
  //Merge configuration settings in with defaults
  config = _.merge(config || {}, {
    persist: false,
    maxItems: null,
    hideSelected: true,
    closeAfterSelect: true,
    allowEmptyOption: true,
  });

  $("#" + selectElementId).selectize(config);
}
