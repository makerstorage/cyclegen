<template>
  <v-stepper v-model="page" class="mt-5">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="d-flex justify-center align-center mb-12"
          color="grey darken-3"
          height="200px"
        >
          <h2>
            <v-avatar color="white" size="50" class="mr-6">
              <span class="white--text headline">
                <v-icon size="40" color="black">arrow_back</v-icon>
              </span>
            </v-avatar>
            Use the commands on the left side to design the cycle moves
          </h2>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey darken-3" height="200px">
          <v-card-title>
            Select your axis:
          </v-card-title>
          <v-card
            class="d-flex justify-center align-center mb-12"
            color="grey darken-3"
            height="200px"
          >
            <v-btn
              class="mx-5"
              style="width:120px; height:120px;"
              dark
              color="indigo"
              elevation="10"
              @click="extruderButtonClicked"
            >
              <v-icon dark>mdi-plus</v-icon>
              Extruder
            </v-btn>
            <v-btn
              class="mx-5"
              style="width:120px; height:120px;"
              dark
              color="indigo"
              elevation="10"
              @click="moldButtonClicked"
            >
              <v-icon dark>mdi-plus</v-icon>
              Mold
            </v-btn>
          </v-card>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card
          class="d-flex justify-center align-center mb-12"
          color="grey darken-3"
          height="200px"
        >
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="distance"
                  label="Distance"
                  outlined
                  :suffix="getDistanceSuffix()"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="speed"
                  label="Speed"
                  outlined
                  suffix="mm/sec"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                class="d-flex justify-center align-center"
              >
                <v-combobox
                  v-model="selectedDirection"
                  :items="directionSelectItems"
                  label="Select a Direction for the move"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-row>
          <v-col cols="12" sm="12" class="d-flex justify-center">
            <v-btn @click="moveAddToListClicked" color="primary"
              >Add to List ></v-btn
            >
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card class="mb-12" color="grey darken-3" height="200px">
          <v-card-title>
            Enter pause duration in mili seconds
          </v-card-title>
          <v-card
            class="d-flex justify-center align-center mb-12"
            color="grey darken-3"
            height="200px"
          >
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="pause"
                    label="Pause"
                    outlined
                    suffix="msec"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-card>
        <v-row>
          <v-col cols="12" sm="12" class="d-flex justify-center mt-5">
            <v-btn @click="pauseAddToListClicked" color="primary"
              >Add to List ></v-btn
            >
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="5">
        <v-card
          class="d-flex justify-center align-center mb-12"
          color="grey darken-3"
          height="200px"
        >
          <h2>
            Code added to the program list
            <v-avatar color="white" size="50" class="ml-6">
              <span class="white--text headline">
                <v-icon size="40" color="black">arrow_forward</v-icon>
              </span>
            </v-avatar>
          </h2>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["page"],
  data() {
    return {
      selectedDirection: null,
      directionSelectItems: [],
      distance: 10,
      speed: 100,
      pause: 1000
    };
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["getselectedAxis", "getpage", "getlistCount"])
  },
  methods: {
    ...mapMutations(["setselectedAxis", "setpage", "addGcode"]),
    extruderButtonClicked() {
      this.setselectedAxis("extruder");
      this.selectedDirection = null;
      this.directionSelectItems = ["Extrude", "Reverse"];
      this.setpage(3);
    },
    moldButtonClicked() {
      this.setselectedAxis("mold");
      this.selectedDirection = null;
      this.directionSelectItems = ["Close", "Open"];
      this.setpage(3);
    },
    getDistanceSuffix() {
      var axis = this.getselectedAxis;
      if (axis == "extruder") {
        return "gr";
      } else {
        return "mm";
      }
    },
    moveAddToListClicked() {
      // validation
      if (!this.selectedDirection) {
        alert("Please select direction");
        return;
      }
      if (!this.distance || this.distance < 0) {
        alert("Distance must have a positive value");
        return;
      }
      if (!this.speed || this.speed < 0) {
        alert("Speed must have a positive value");
        return;
      }

      var axis = "X";
      if (this.getselectedAxis == "mold") {
        axis = "Z";
      }

      var yon = "";
      if (
        this.selectedDirection == "Extrude" ||
        this.selectedDirection == "Close"
      ) {
        yon = "-";
      }

      var command = "G1" + axis + yon + this.distance + "F" + this.speed;
      var gcode = {
        id: this.getlistCount,
        gcode: command,
        description: "Move Command"
      };
      this.addGcode(gcode);
      this.setpage(5);
    },
    pauseAddToListClicked() {
      if (!this.pause || this.pause < 0) {
        alert("Please enter valid pause duration");
        return;
      }
      var command = "G4 " + "P" + this.pause;
      var gcode = {
        id: this.getlistCount,
        gcode: command,
        description: "Pause Command"
      };
      this.addGcode(gcode);
      this.setpage(5);
    }
  }
};
</script>
