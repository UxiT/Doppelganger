import { createRouter, createWebHistory } from 'vue-router';
import MainView from "@/views/MainView/MainView.vue";
import LoginView from "@/views/LoginView/LoginView.vue";
import RegisterView from "@/views/RegisterView/RegisterView.vue";


const routes = [
  { path: '/', component: MainView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
