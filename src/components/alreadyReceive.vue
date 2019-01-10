<template>
    <div>
        <!--receiveConfirm  收货确认-->
        <div class="m_blueBg">
            <span class="float_L m_spam"><img src="../assets/img/time.png" width="100%" alt="time"></span>
            <span class="float_L m_word">已确认收货</span>

            <div class="m_address">
                <!--34635-->
                <div class="clearFloat m_clear">
                    <span class="float_L m_water"><img src="../assets/img/water.png" width="100%" alt="time"></span>
                    <span class="float_L m_waterZi">货架信息：</span>
                </div>
                <div class="m_realAd">
                    北京朝阳小盒科技园1号售货柜北京朝阳小盒科技园1号售货柜
                </div>

            </div>
        </div>

        <h2 class="m_allNum">
            总配送数量：{{allCount}}
        </h2>

        <!--这里是商品展示图-->
        <ul class="m_ulLeft">
            <li class="clearFloat m_ulLi" v-for="(a,i) in goodsArr" :key="a.id">
                <div class="float_L m_divImg">
                    <img v-if="a.mainImg != ''" :src="a.mainImg" width="100%" height="100%" alt="time">
                    <img v-else src="../assets/img/noImg.png" width="100%" height="100%" alt="time">
                </div>
                <div class="float_L m_width">
                    <p class="m_goodsName">{{a.goodsName}}</p>
                    <p class="m_specsInfo">{{a.goodsSpecs}}</p>
                    <div class="clearFloat">
                        <div class="float_L m_count m_right">应配送数量：{{a.deliveryNum}}</div>
                        <div class="float_L m_count m_success">实配送数量：{{a.realNum}}</div>
                        <div class="float_R m_count m_error"><span v-if="a.calcNum>0">+</span>{{a.calcNum}}</div>

                    </div>
                </div>
            </li>
        </ul>

        <div class="m_empty"></div>

        <div class="m_anoZong">实配送数量： <span>{{realCount}}</span></div>

        <div class="m_operate clearFloat">
            <span class="float_L m_lookRemark" @click="remarkVisible = true">查看备注</span>
            <div class="float_R m_lineHeight">
                <button type="button" class="m_btnConfirm" @click="closeWin">关闭</button>
            </div>
        </div>

        <!--一个底部弹出框   输入实际配送量和备注信息-->
        <mt-popup
                v-model="popupVisible"
                class="m_selfPopover"
                position="bottom">
            <div class="m_popover">
                <!--在底部出现的一个popover-->
                <div class="m_headPop">
                    <span class="m_normalSpan" @click="popupVisible = false">取消</span>
                    <span class="m_nameSpan" v-if="oData">{{oData.goodsName}}</span>
                    <span class="m_normalSpan m_activeSpan" @click="popoverSure">确定</span>
                </div>
                <div class="m_form">
                    <label for="num1">实配送数量：</label><br>
                    <input type="text" id="num1" placeholder="请输入" v-model="singlerealCount">
                    <label for="num2">备注信息：</label><br>
                    <input type="text" id="num2" placeholder="请输入" v-model="singleremark">
                </div>

            </div>
        </mt-popup>

        <!--备注底部弹框-->
        <mt-popup
                v-model="remarkVisible"
                class="m_selfPopover"
                position="bottom">
            <div class="m_anotherPop">
                <div class="m_ding">
                    <div class="m_headPop">
                        <span class="m_normalSpan" ></span>
                        <span class="m_nameSpan">备注信息</span>
                        <span class="m_normalSpan m_activeSpan" @click="remarkVisible = false">关闭</span>
                    </div>
                </div>
                <ul class="m_popUl">
                    <li  v-for="(a,i) in goodsArr" :key="a.id">
                        <div class="m_divRemark"><span class="m_blueCircle"></span><span>{{a.goodsName}}</span></div>
                        <p class="m_ParagraphR">备注信息：实配送数量（{{a.realNum}}）{{a.remark}}</p>

                    </li>
                </ul>

            </div>
        </mt-popup>

    </div>
</template>

<script>
	let num = -100;
	import { Toast } from 'mint-ui';
	export default {
		name: 'alreadyReceive',
		data () {
			return {
				openValue: true,
				remarkVisible: false,
				popupVisible: false,
				oData: null,//当前正在操作的那条数据
				allCount: null,//总配送数量
				realCount: null,//实际配送数量
				singlerealCount: null,//单个产品 实际配送数量
				singleremark: null,//单个产品 备注
				goodsArr: [
					{
						id: num++,
						goodsName: '这是商品名称1111',
						goodsSpecs: '这是商品规格',
						realNum: 21,//实际配送数量
						deliveryNum: 20,//配送数量
						calcNum: null,//计算之后的数量
						isCommon: null,//是否一致  true,,一致  false,,不一致
						remark: null,//备注信息
					},
					{
						id: num++,
						goodsName: '这是商品名称2222',
						goodsSpecs: '这是商品规格',
						realNum: 18,//实际配送数量
						deliveryNum: 20,//配送数量
						calcNum: null,//计算之后的数量
						isCommon: null,//是否一致  true,,一致  false,,不一致
						remark: null,//备注信息
					},
				],//存放所有商品
			}
		},
		methods: {
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

			//补货列表
			getRestockList: function () {
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
								case 1:

									break;
								case 2:
									Toast({
										message: '参数错误',
									});
									break;
                                //已收货
								case 3:

									this.shelfAd = data.name.split('>').join(' ');
									if(data.skuList != null){
										this.allCount = 0;
										data.skuList.forEach(a => {
											a.goodsName = a.name ;//这是商品名称
											a.goodsSpecs = a.skuName ;//这是商品规格
											a.realNum = a.realReplienishStock ;//实际配送数量
											a.deliveryNum = a.replienishStock ;//配送数量 java
											a.calcNum = (a.realReplienishStock - a.replienishStock) ;//计算之后的数量
											a.isCommon = null ;//是否一致  true,,一致  false,,不一致
											a.remark = a.deliveryMemo ;//备注信息

											this.allCount += Number(a.deliveryNum)
											this.realCount += Number(a.realNum)
										})
										this.goodsArr = [] ;
										this.goodsArr = data.skuList ;
										//console.log(this.goodsArr);
									};

									break;
								case 4:
									Toast({
										message: '数据不存在',
									});

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
			//是否一致
			isConsitent: function (boolean,a,i) {
				switch (boolean) {
					case true ://一致
						a.isCommon = true ;
						a.calcNum = 0 ;
						this.calcRealFn()
						break;
					case false ://不一致
						this.popupVisible = true
						this.oData = a

						break;
				}

			},
			//popover点击确定
			popoverSure: function () {

				if(!this.singlerealCount){
					//console.log(44);
					Toast({
						message: '请输入框实际配送数量',
					});
				}else{
					if(this.singlerealCount == this.oData.deliveryNum){//输入相等的情况
						this.oData.isCommon = true
						this.oData.realNum = this.singlerealCount
						//this.oData.remark = this.singleremark
						this.oData.calcNum = 0
					}else{
						this.oData.isCommon = false
						this.oData.realNum = this.singlerealCount
						this.oData.remark = this.singleremark
						this.oData.calcNum = this.singlerealCount - this.oData.deliveryNum
					}
					this.popupVisible = false
					this.calcRealFn() ;

				}
			},
			//计算实际配送数量
			calcRealFn: function () {
				let b = 0;
				this.goodsArr.forEach((a,i) => {
					if(a.isCommon == true){
						b += Number(a.deliveryNum)
					}else if(a.isCommon == false){
						b += Number(a.realNum)
					}
				})
				this.realCount = b

			},


		},
		mounted: function () {
			//页面初始化
			this.getRestockList();
		}
	}
</script>

<style scoped>
    @import url('../styles/confirmStyle.css');

</style>
