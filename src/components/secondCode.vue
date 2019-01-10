<template>
    <div>
        <!--第二次在这个页面获取code-->
        <!--secondCode-->
        加载中....
    </div>
</template>

<script>
	export default {
		name: 'secondCode',
        methods: {
	        //获取地址栏传参
	        GetQueryString: function(name) {
		        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		        var r = decodeURI(window.location.search).substr(1).match(reg);
		        if(r != null) return unescape(r[2]);
		        return null;
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
							        localStorage.token = data.token ;
							        localStorage.code = data.userInfo.code ;
							        localStorage.avatar = data.userInfo.avatar ;
							        localStorage.phone = data.userInfo.phone ;
							        localStorage.nickName = data.userInfo.nickName ;
							        localStorage.openId = data.userInfo.openId ;
							        this.$router.push({
								        path: '/receiveConfirm',//  补货页面
							        });
							        break;
						        //用户未授权   前端调用/loginByPassword登录接口
						        case 4 :
							        //停留在当前这个登录页
							        localStorage.token = data.token ;
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

			let code = this.GetQueryString("code");
			if(code != null){
				console.log('这个是获取的',code);
				this.initInfo( code ) ;
			}

		}

	}
</script>

<style scoped>

</style>
