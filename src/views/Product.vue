<template>
  <div id="Product">
    <div style="padding-bottom: 5%">
      <v-btn
          class="ma-2"
          color="orange darken-2"
          @click="goToScore"
      >คะแนน
      </v-btn>
      &nbsp;
      <v-btn
          class="ma-2"
          color="orange darken-2"
          @click="goToProduct"
          dark
      >สินค้า
      </v-btn>
    </div>
    <v-row>
      <h2>สินค้าทั้งหมด</h2>
      &nbsp;&nbsp;&nbsp;
      <v-btn
          style="background-color:deepskyblue "
          @click="openForm"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>


    <div data-app>
      <v-dialog
          v-model="dialogForm"
          max-width="100%"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <div class="container">
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="nameProd"
                      label="ชื่อสินค้า"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="scoreProd"
                      label="คะแนนที่ใช้แลก"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <input type="file" class="form-control" @change="onFileChange">
                <hr>
                <img :src="imageProd" class="img-fluid" style="max-width: 100%">
                <hr>
              </v-row>
            </div>
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
      <v-dialog v-model="dialog" max-width="60%" @keydown.esc="cancel">
        <v-card>
          <v-img :src="picture" alt="" contain/>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table
        :headers="headers"
        :items="this.$store.state.products"
        :items-per-page="10"
        class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="$store.state.apiUrl+'/image/product/'+item.image" :alt="item.name" height="100px" width="100px" @click="openPic(item.image)"/>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>

import axios from "axios";
import router from "@/router";

export default {
  name: "Product",
  data(){
    return{
      picture:"",
      dialog:false,
      dialogForm:false,
      file:"",
      imageProd:"",
      nameProd:"",
      scoreProd:"",
      formTitle:"เพิ่มสินค้า",
      headers: [
        { text: '', value: 'image' },
        { text: 'ชื่อสินค้า', value: 'name' },
        { text: 'คะแนนที่ใช้แลก', value: 'score' },
      ]
    }
  },
  mounted() {
    axios
        .get(this.$store.state.apiUrl+"/product/all")
        .then(response =>{
          this.$store.state.products = response.data
        })
        .catch(error => console.log(error))
  },
  methods:{
    goToScore(){
      router.push("/admin/score")
    },
    goToProduct(){
      router.push("/admin/product")
    },
    openPic(image) {
      this.dialog = true
      this.picture = this.$store.state.apiUrl+'/image/product/'+image
    },
    cancel() {
      this.dialog = false
    },
    openForm(){
      this.dialogForm = true
    },
    close(){
      this.dialogForm = false
    },
    save(){
      if (this.nameProd !== '' && this.scoreProd !== '0' && this.scoreProd !== ''){
        let formData = new FormData()
        formData.append("name",this.nameProd)
        formData.append("score",this.scoreProd)
        formData.append("image",this.file)
        axios
            // eslint-disable-next-line no-undef
            .post(this.$store.state.apiUrl+"/product/create",formData)
            .then(response => {
              if(response.data.status == 1){
                alert("สร้างสินค้าสำเร็จ")
                this.dialogForm = false
                this.goToProduct()
              }else{
                console.log(response.data)
                alert("สร้างสินค้าไม่สำเร็จ!!!")
              }
            })
            .catch(error => console.log(error))
      }
      else{
        if (this.nameProd == ''){
          alert("กรุณากรอกชื่อสินค้า")
        }
        if (this.scoreProd == '0'){
          alert("คะแนนสินค้าต้องมากกว่าศูนย์")
        }
        if (this.scoreProd == ''){
          alert("กรุณากรอกคะแนนสินค้า")
        }
      }
    },
    onFileChange: function (e) {
      var files = e.target.files
      this.file = files[0]
      if (!files.length)
        return
      this.createImage(files[0]);
    },
    createImage(files) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.imageProd = e.target.result;
      }
      reader.readAsDataURL(files)
    },

  }

}
</script>

<style scoped>

</style>