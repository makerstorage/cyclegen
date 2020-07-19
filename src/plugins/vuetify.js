import Vue from "vue";
import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md" || "fa",
  },
  theme: {
    light: {
      background: colors.grey.lighten2,
    },
    dark: {
      background: colors.shades.white,
    },
  },
});
