import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import secondCode from '@/components/secondCode'
import successView from '@/components/successView'
import receiveConfirm from '@/components/receiveConfirm'
import alreadyConfirm from '@/components/alreadyConfirm'
import alreadyReceive from '@/components/alreadyReceive'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/secondCode',
      name: 'secondCode',
      component: secondCode
    },
    {
      path: '/successView',
      name: 'successView',
      component: successView
    },
    {
      path: '/receiveConfirm',
      name: 'receiveConfirm',
      component: receiveConfirm
    },
    {
      path: '/alreadyConfirm',
      name: 'alreadyConfirm',
      component: alreadyConfirm
    },
    {
      path: '/alreadyReceive',
      name: 'alreadyReceive',
      component: alreadyReceive
    },
  ]
})
