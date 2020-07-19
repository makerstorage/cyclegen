<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list class="mt-16" rounded>
        <v-list-item
          class="mt-14 mb-12"
          v-for="item in items"
          :key="item.title"
          link
          @click="clickListItem(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon>
        <v-icon>home</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Cycle Generator </v-toolbar-title>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row class="mb-6" no-gutters>
          <v-col sm="5" md="9">
            <v-toolbar dark>
              <v-toolbar-title
                >Selected Axis: {{ getselectedAxis }}</v-toolbar-title
              >
            </v-toolbar>

            <select-axis :page="getpage" />
          </v-col>
          <v-col sm="5" offset-sm="2" md="3" offset-md="0">
            <v-container
              id="scroll-target"
              style="max-height: 700px"
              class="overflow-y-auto"
            >
              <v-list light>
                <v-list-item-group
                  v-model="listIndex"
                  active-class="blue--text"
                >
                  <v-list-item v-for="gcode in getgcodes" :key="gcode.id">
                    <v-list-item-icon>
                      <v-icon color="green">arrow_right_alt</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="gcode.gcode"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="gcode.description"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon @click="itemDeleteClicked(gcode.id)" color="red"
                        >highlight_off</v-icon
                      >
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-row
                v-scroll:#scroll-target="onScroll"
                light
                align="center"
                justify="center"
                style="height: 10px"
              >
              </v-row>
            </v-container>
            <v-container>
              <v-toolbar dark dense>
                <v-toolbar-title dense
                  >Lines: {{ getlistCount }}
                </v-toolbar-title>
              </v-toolbar>

              <v-btn
                @click="downloadCode"
                color="primary"
                block
                style="height:50px;"
                >Export Code
                <v-icon right>code</v-icon>
              </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import selectAxis from "./components/selectAxis.vue";

export default {
  name: "App",

  components: {
    selectAxis
  },

  data() {
    return {
      items: [
        { title: "Add Home", icon: "home" },
        { title: "Add Move", icon: "play_arrow" },
        { title: "Add Pause", icon: "pause" }
      ],

      selectedCommand: {},
      showPage: 1,
      listIndex: 1
    };
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["getselectedAxis", "getpage", "getgcodes", "getlistCount"])
  },
  methods: {
    ...mapMutations([
      "setselectedAxis",
      "setpage",
      "addGcode",
      "setlistCount",
      "deletegcode"
    ]),
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    clickListItem(selectedItem) {
      //this.selectedCommand = selectedItem;
      // this.showPlaces = true;
      //alert(this.selectedCommand.title);
      switch (selectedItem.title) {
        case "Add Home":
          this.commadAddHome();
          break;
        case "Add Move":
          this.commadAddMove();
          break;
        case "Add Pause":
          this.commadAddPause();
          break;
      }
    },
    commadAddHome() {
      this.setselectedAxis("mold");
      var gcode = {
        id: this.getlistCount,
        gcode: "G28 Z",
        description: "home mold axis"
      };
      this.addGcode(gcode);
      this.setpage(5);
    },
    commadAddMove() {
      this.setpage(2);
    },
    commadAddPause() {
      this.setpage(4);
    },
    itemDeleteClicked(index) {
      this.deletegcode(index);
    },
    downloadCode() {
      var gcodes = this.getgcodes;
      var text = "";
      gcodes.forEach(function(row) {
        text = text + row.gcode + "\r\n";
      });

      // console.log(text);

      //var data = new Blob([text], { type: "text/plain" });

      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", "rum.gco");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
};
</script>
