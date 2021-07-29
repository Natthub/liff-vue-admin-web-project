<template>
  <div id="Score">
    <div style="padding-bottom: 5%">
      <v-btn
          class="ma-2"
          color="orange darken-2"
          @click="goToScore"
          dark
      >คะแนน
      </v-btn>
      &nbsp;
      <v-btn
          class="ma-2"
          color="orange darken-2"
          @click="goToProduct"
      >สินค้า
      </v-btn>
    </div>

    <h2>คะแนนใบเสร็จ</h2>
    <div data-app>
      <v-dialog
          v-model="dialog"
          max-width="100%"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedItem.receiptID"
                      label="เลขที่ใบเสร็จ"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedItem.score"
                      label="คะแนน"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="close"
            >
              Cancel
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
      <v-dialog v-model="dialogPicture" max-width="60%" @keydown.esc="cancel">
        <v-card>
          <v-img :src="picture" alt="" contain/>
        </v-card>
      </v-dialog>
    </div>
    <v-data-table
        ref="table"
        :headers="headers"
        :items="this.$store.state.receipts"
        class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="$store.state.apiUrl+'/image/receipt/'+item.image" :alt="item.name" height="100px" width="100px" @click="openPic(item.image)"/>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>

      </template>
      <template v-slot:no-data>
        <h2>ยังไม่มีใบเสร็จ</h2>
      </template>
    </v-data-table>
  </div>
</template>

<script>

import axios from "axios";
import router from "@/router";

export default {
  data: () => ({
    dialog: false,
    dialogPicture:false,
    picture:"",
    headers: [
      { text: '', value: 'image' },
      { text: 'userID', value: 'userID' },
      { text: 'เลขที่ใบเสร็จ', value: 'receiptID' },
      { text: 'คะแนน', value: 'score' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      receiptID: '',
      score: 0,
      userID:""
    },
    defaultItem: {
      receiptID: '',
      score: 0,
      userID:""
    },
  }),
  mounted() {
    this.getReceipt()
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'ให้คะแนนใบเสร็จ' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  methods: {
    goToScore(){
      router.push("/admin/score")
    },
    goToProduct(){
      router.push("/admin/product")
    },
    openPic(image) {
      this.dialogPicture = true
      this.picture = this.$store.state.apiUrl+'/image/receipt/'+image
    },
    cancel() {
      this.dialogPicture = false
    },
    getReceipt(){
      axios
          .get(this.$store.state.apiUrl+"/receipt/nonscore")
          .then(response =>{
            this.$store.state.receipts = response.data
          })
          .catch(error => console.log(error))
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        console.log(this.editedItem)
        let formData = new FormData()
        formData.append("userID",this.editedItem.userID)
        formData.append("receiptID",this.editedItem.receiptID)
        formData.append("score",this.editedItem.score)
        axios
            // eslint-disable-next-line no-undef
            .post(this.$store.state.apiUrl+"/receipt/addscore",formData)
            .then(async response => {
              console.log(response.data)
              await this.getReceipt()
            })
            .catch(error => console.log(error))
        // this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style scoped>

</style>