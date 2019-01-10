<template>
    <div>
        <!--successView  收货成功要展示的东西-->
        <div class="m_wDiv">
            <span>
                <img src="../assets/img/success.png" width="100%" alt="success">

            </span>
        </div>
        <h2 class="m_headerTwo">已确认收货</h2>
        <p class="clearFloat m_Paragraph">
            <span class="float_L m_title">收货时间</span>
            <span class="float_R m_anoterh">{{showInfo.deliveryTime}}</span>
        </p>
        <p class="clearFloat m_Paragraph">
            <span class="float_L m_title">货架名称</span>
            <span class="float_R m_anoterh m_name">{{showInfo.name}}</span>
        </p>
        <p class="clearFloat m_Paragraph">
            <span class="float_L m_title">总配送数</span>
            <span class="float_R m_anoterh">{{showInfo.replienishStock}}</span>
        </p>
        <p class="clearFloat m_Paragraph">
            <span class="float_L m_title">实配送数</span>
            <span class="float_R m_anoterh">{{showInfo.realReplienishStock}}</span>
        </p>
        <div class="m_divBrd"></div>
        <div class="m_btnDiv">
            <input type="button" value="关闭" class="m_anotherBtn" @click="closeWin">
            <input type="button" value="查看到货明细" class="m_anotherBtn m_not" @click="toAnother">

        </div>

    </div>
</template>

<script>
	export default {
		name: 'alreadyConfirm',
		data () {
			return {
				showInfo: {},//要展示的信息
			}
		},
		methods: {
			//获取初始化信息
			getInitInfo: function () {
				let params = {
					"requestBody":{
						"wapReplienishmentModel":{
							"recordId": localStorage.recordId,//recordId
							"machineId": localStorage.machineId //机器id
						}
					},
					"requestHead":{
						"token":localStorage.token
					}
				};
				this.$http.post("/replenishment/getReplenishmentShelf" , params)
					.then((res) => {
						if (res.data.responseHead.code == 200) {
							let data = res.data.responseBody.data;

							switch(Number(data.code)) {
								case 3:
									//console.log(555);
									let obj = {
										name: data.name.split('>').join('') ,
										replienishStock: data.replienishStock ,
										realReplienishStock: data.realReplienishStock ,
										deliveryTime: this.formate_time_stamp(data.deliveryTime) ,
									};

									this.showInfo = Object.assign({}, obj )
									break;
							};
							//console.log(data);

						}
					})
					.catch(err => {
						Toast({
							message: '后台错误,请联系客服',
						});
					});

			},

			//点击确定关闭窗口
			closeWin: function () {
				//window.opener=null;
				//window.open('','_self');
				//window.close();
				//open(location, '_self').close();
				WeixinJSBridge.call('closeWindow');
				//window.location.href="about:blank";
				//window.close();

			},
            //到另外一个页面呢
			toAnother: function () {
				this.$router.push({
				   path: '/alreadyReceive',
				});

			},
		},
		mounted: function () {
			this.getInitInfo();
		},
	}
</script>

<style scoped>
    @import url('../styles/successStyle.css');

</style>
