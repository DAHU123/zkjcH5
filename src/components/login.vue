<template>
    <div class="zk_HFive">

        <!--login   这个是登录页-->
        <div class="m_cont">
            <!--logo-->
            <div class="m_div">
                <span class="m_wLogo">
                    <img src="../assets/img/logo_zk.png" width="100%" alt="logo">

                </span>
            </div>

            <!--这个地方是用来放表单的-->
            <div class="m_formW">
                <form class="mui-input-group">
                    <div class="mui-input-row">
                        <input type="text" class="mui-input-clear m_Input" placeholder="请输入账号" v-model="account" @blur="setError(1)">
                        <span class="m_loginError" v-if="isShowAccount">请输入</span>
                    </div>
                    <div class="mui-input-row">
                        <input type="password" class="mui-input-password m_Input" placeholder="请输入密码" v-model="password" @blur="setError(2)">
                        <span class="m_loginError" v-if="isShowPswd">请输入</span>
                    </div>
                    <div class="mui-button-row m_top">
                        <button type="button" class="mui-btn mui-btn-primary m_loginBtn" @click="clickLogin">登 录</button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import WXConfig from '../assets/weChat/appConfig';

	export default {
		name: 'login',
        data () {
			return {
                isShowAccount: false,
                isShowPswd: false,
                account: '',//账号名
                password: '',//密码
            }
        },
        methods: {
			//点击登录
	        clickLogin: function () {
                if(this.account == ''){
                	this.isShowAccount = true;
	                Toast({
		                message: '请完善信息',
	                });
	                return false;
                }else{
	                this.isShowAccount = false;
                };
                if(this.password == ''){
                	this.isShowPswd = true;
	                Toast({
		                message: '请完善信息',
	                });
	                return false;
                }else{
	                this.isShowPswd = false;
                };

                //将信息发送给java
                this.loginInfoJava() ;

                //暂且注释
                //this.$router.push({
			     //   path: '/receiveConfirm',
                //});


	        },
	        //将信息发送给java
            loginInfoJava: function () {
	            let params = {
		            "requestBody":{
			            "wapCommonModel":{
				            "loginCode": this.account,
				            "password": this.password,
				            "openId": localStorage.openId
			            }
		            },
                };

	            this.$http.post('/common/loginByPassword',params)
		            .then(res => {
			            if (res.data.responseHead.code == 200) {
				            let data = res.data.responseBody.data;

				            switch (Number(data.code)) {
					            //登录成功， 前端访问授权页面  授权陈宫以后就直接跳转到补货页面
					            case 1 :
						            localStorage.token = res.data.responseHead.token ;
						            localStorage.code = data.userInfo.code ;
						            localStorage.avatar = data.userInfo.avatar ;
						            localStorage.phone = data.userInfo.phone ;
						            localStorage.nickName = data.userInfo.nickName ;
						            localStorage.openId = data.userInfo.openId ;

					            	let encoderUrl = WXConfig.projUrl+ '?lili=' + WXConfig.secondCode ;
					            	//let newUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXConfig.WX_APPID + '&redirect_uri='+ encoderUrl + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
						            let newUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+WXConfig.WX_APPID+'&redirect_uri='+encoderUrl+'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect' ;
						            window.open(newUrl,'_self')

						            break;
					            case 2 :
						            Toast({
						               message: '用户不存在',
						            });
						            break;
					            case 3 :
						            Toast({
							            message: '密码错误',
						            });
						            break;

				            }

			            }
		            })
		            .catch(err => {
			            Toast({
				            message: '后台错误,请联系客服',
			            });
                    });

            },

            //设置输入框当前状态
	        setError: function (params) {
                switch (params) {
                    case 1 :
	                    if(this.account == ''){
		                    this.isShowAccount = true;

	                    }else{
		                    this.isShowAccount = false;

	                    }
                    	break ;
                    case 2 :
                    	if(this.password == ''){
		                    this.isShowPswd = true;

	                    }else{
		                    this.isShowPswd = false;

	                    }
                    	break ;
                }
	        },
	        //获取地址栏传参
	        GetQueryString: function(name) {
		        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		        var r = decodeURI(window.location.search).substr(1).match(reg);
		        if(r != null) return unescape(r[2]);
		        return null;
	        },
	        //调用接口  获取 长连接
	        getLongLink: function(WX_URL) {

		        this.$http.get("/common/getSdUrl/" + WX_URL )
			        .then((res) => {
				        if (res.data.responseHead.code == 200) {
					        let data = res.data.responseBody.data;
					        //console.log(22);
					        console.log(data.sdUrl);

                            //在部署到线上的时候把这个注释解除
                            window.open(data.sdUrl,'_self')

				        }
                    })
			        .catch(err => {
				        //alert('初始化失败');
				        Toast({
					        message: '初始化失败',
				        });

				        //console.log('失败');
				        //console.log(error);
			        });

	        },
            //调初始化接口
            initInfo: function (code) {
	            this.$http.get("/common/init/" + code )
		            .then((res) => {
			            if (res.data.responseHead.code == 200) {
				            let data = res.data.responseBody.data;

				            switch (Number(data.code)) {
				               //登录成功，直接进入补货页面
				                case 1 :
				                   //alert('成功')
				                   localStorage.code = data.userInfo.code ;
				                   localStorage.avatar = data.userInfo.avatar ;
				                   localStorage.phone = data.userInfo.phone ;
				                   localStorage.nickName = data.userInfo.nickName ;
				                   localStorage.openId = data.userInfo.openId ;
				                   localStorage.token = data.token ;
				                   this.$router.push({
				                       path: '/receiveConfirm',//  补货页面
				                   });
				                	break;
				               //用户未授权   前端调用/loginByPassword登录接口
				                case 4 :
				                	//停留在当前这个登录页
					                localStorage.code = data.userInfo.code ;
					                localStorage.avatar = data.userInfo.avatar ;
					                localStorage.phone = data.userInfo.phone ;
					                localStorage.nickName = data.userInfo.nickName ;
					                localStorage.openId = data.userInfo.openId ;

				                	break;
				                case 9 :
				                   //alert('微信错误')
				                   Toast({
				                       message: '微信错误',
				                   });

				                   break;

				            }

			            }
		            })
		            .catch(err => {
			            //alert('初始化失败');
			            Toast({
				            message: '初始化失败',
			            });

			            //console.log('失败');
			            //console.log(error);
		            });

            },

        },
        mounted: function () {
	        //获取 长连接
	        let WX_URL = this.GetQueryString("WX_URL");
	        if(WX_URL != null){
		        console.log('WX_URL',WX_URL);
		        this.getLongLink(WX_URL) ;
            }

	        let code = this.GetQueryString("code");
	        if(code != null){
		        console.log('这个是获取的',code);
		        this.initInfo( code ) ;

            }

	        let recordId = this.GetQueryString("recordId");
	        if(recordId != null){
		        localStorage.recordId = this.GetQueryString("recordId") ;
		        localStorage.machineId = this.GetQueryString("machineId") ;
            }

	        let lili = this.GetQueryString("lili");
	        if(lili != null){
		        //console.log('这个是获取的',lili);
		        this.$router.push({
			        path: '/secondCode',//  补货页面
		        });

            }



        }
	}
</script>

<style scoped>
    @import url('../styles/loginStyle.css');
</style>
