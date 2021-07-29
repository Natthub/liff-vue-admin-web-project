import Vue from 'vue'
import VueRouter from 'vue-router'
import Score from "@/views/Score";
import Product from "@/views/Product";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Score
  },
  {
    path: '/admin/score',
    name: 'Score',
    component: Score
  },
  {
    path: '/admin/product',
    name: 'Product',
    component: Product
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
