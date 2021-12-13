const { createPage } = require("../../../core/createFactory");
const { wxStorage } = require("../../../core/storage");
const { formatTime } = require("../../../libs/utils");

createPage({
  data: {
    count: 0,
    ignoreShare: true,
  },
  computed: {
    countDesc(data) {
      return `Count: ${data.count}`;
    },
  },
  onLoad() {
    this.setData({
      count: 100,
    });
  },
  methods: {
    onGet() {
      console.log(wxStorage.get("test"));
    },
    onSet() {
      wxStorage.set("test", `test${formatTime(new Date(), true)}`, 1000);
    },
    onAddCount() {
      this.setData({
        count: this.data.count + 1,
      });
    },
  },
});
