const xwmlTemplate = `
<view class="global-page-container page-container"></view>
`;

const lessTemplate = `
.page-container {}
`;

const pageJsTemplate = `
Page({})
`;

exports.getXwmlTemplate = () => xwmlTemplate;
exports.getLessTemplate = () => lessTemplate;
exports.getJsonTemplate = (name, title) => `
{
  "navigationBarTitleText": "${title}"
}`;
exports.getPageJsTemplate = () => pageJsTemplate;
