<template>
    <div>
        <!--receiveConfirm  收货确认-->
        <div class="outbig">
        	<div class="outbig_">
		        <div class="m_blueBg">
		            <span class="float_L m_spam"><img src="../assets/img/time.png" width="100%" alt="time"></span>
		            <span class="float_L m_word">收货确认</span>
		
		            <div class="m_address">
		                <!--34635-->
		                <div class="clearFloat m_clear">
		                    <span class="float_L m_water"><img src="../assets/img/water.png" width="100%" alt="time"></span>
		                    <span class="float_L m_waterZi" @click="popupVisible = true">货架信息：</span>
		                </div>
		                <div class="m_realAd">
		                    {{shelfAd}}
		                    <!--北京朝阳小盒科技园1号售货柜北京朝阳小盒科技园1号售货柜-->
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
		                        <div class="float_L m_count">配送数量：{{a.deliveryNum}}</div>
		                        <div class="float_R">
		                            <button type="button" :class="{ m_selfBtn: true , m_rightMar: true , m_btnActive: !a.isCommon && a.isCommon!=null }" @click="isConsitent(false,a,i)">不一致<span v-if="!a.isCommon && a.isCommon!=null">({{a.realNum}})</span></button>
		                            <button type="button" :class="{ m_selfBtn: true , m_btnActive: a.isCommon }" @click="isConsitent(true,a,i)">一致</button>
		                        </div>
		                    </div>
		                </div>
		            </li>
		        </ul>
		
		        <div class="m_empty"></div>
		
		        <!--这里是商品汇总数量-->
		        <ul class="m_list">
		            <li class="clearFloat" v-for="(a,i) in goodsArr" :key="a.id">
		                <span class="float_L zk_showE">{{a.goodsName}}</span>
		                <span class="float_R"><span v-if="a.calcNum>0">+</span>{{a.calcNum}}</span>
		            </li>
		        </ul>
		
		        <div class="m_zong">实配送数量： <span>{{realCount}}</span></div>
		
		        
		    </div>    
        </div>
        <div class="m_operate clearFloat">
            <span class="float_L m_lookRemark" @click="remarkVisible = true">查看备注</span>
            <div class="float_R m_lineHeight">
                <button type="button" class="m_btnConfirm" @click="sureConfirm">确认收货</button>
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
                    <span class="m_nameSpan" v-if="oData">{{oData.goodsName.slice(0,8)}}<span v-if="oData.goodsName.length > 8">...</span></span>
                    <span class="m_normalSpan m_activeSpan" @click="popoverSure">确定</span>
                </div>
                <div class="m_form">
                    <label for="num1">实配送数量：</label><br>
                    <input type="text" id="num1" placeholder="请输入" v-if="oData" v-model="oData.realNum">
                    <label for="num2">备注信息：</label><br>
                    <input type="text" id="num2" placeholder="请输入" v-if="oData" v-model="oData.remark">
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
		name: 'receiveConfirm',
        data () {
			return {
				shelfAd: null,//货架地址
				remarkVisible: false,
				popupVisible: false,
				oData: null,//当前正在操作的那条数据
				allCount: null,//总配送数量
				realCount: null,//实际配送数量
				singlerealCount: null,//单个产品 实际配送数量
				singleremark: null,//单个产品 备注
				goodsArr:[],//存放所有商品
                //goodsArr: [
                //    {
                //    	id: num++,
                //    	goodsName: '这是商品名称1111这是商品名称1111这是商品名称1111',
                //    	goodsSpecs: '这是商品规格',
                //    	realNum: null,//实际配送数量
                //    	deliveryNum: 20,//配送数量
                //    	calcNum: null,//计算之后的数量
                //    	isCommon: null,//是否一致  true,,一致  false,,不一致
                //    	remark: null,//备注信息
                //    },
                //    {
	             //       id: num++,
                //    	goodsName: '这是商品名称2222',
                //    	goodsSpecs: '这是商品规格',
                //    	realNum: null,//实际配送数量
                //    	deliveryNum: 20,//配送数量
	             //       calcNum: null,//计算之后的数量
                //    	isCommon: null,//是否一致  true,,一致  false,,不一致
	             //       remark: null,//备注信息
                //    },
                //],//存放所有商品
            }
        },
        methods: {
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
                                	this.shelfAd = data.name.split('>').join(' ');
                                	if(data.skuList != null){
		                                this.allCount = 0;
		                                data.skuList.forEach(a => {
                                            a.goodsName = a.name ;//这是商品名称
                                            a.goodsSpecs = a.skuName ;//这是商品规格
                                            a.realNum = null ;//实际配送数量
		                                	a.deliveryNum = a.replienishStock ;//配送数量 java
		                                	a.calcNum = null ;//计算之后的数量
		                                	a.isCommon = null ;//是否一致  true,,一致  false,,不一致
		                                	a.remark = null ;//备注信息
			                                this.allCount += Number(a.deliveryNum)
                                        })
		                                this.goodsArr = [] ;
		                                this.goodsArr = data.skuList ;
	                                };

                                	break;
                                case 2:
	                                Toast({
		                                message: '参数错误',
	                                });
                                	break;
                                case 3:
	                                //Toast({
		                             //   message: '已收货',
	                                //});
	                                this.$router.push({
		                                path: '/alreadyConfirm',//  已确认收货
	                                });

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
		        let reg = /^(0|\+?[1-9][0-9]*)$/;//0和正整数

		        if(!this.oData.realNum){
			        //console.log(44);
			        Toast({
				        message: '请输入实际配送数量',
				        position: 'bottom',
				        className: 'zk_mShow',
			        });
		        }else if(!reg.test(this.oData.realNum)){
			        Toast({
				        message: '请输入0或者正整数',
				        position: 'bottom',
				        className: 'zk_mShow',
			        });
		        }else{
			        if(Number(this.oData.realNum) == this.oData.deliveryNum){//输入相等的情况
				        this.oData.isCommon = true
				        this.oData.realNum = this.oData.realNum
				        this.oData.calcNum = 0
			        }else{
				        this.oData.isCommon = false
				        this.oData.realNum = this.oData.realNum
				        this.oData.calcNum = Number(this.oData.realNum) - this.oData.deliveryNum
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
                		b += Number(a.deliveryNum) ;
		                a.realNum = a.deliveryNum ;
		                //console.log(a);
	                }else if(a.isCommon == false){
		                b += Number(a.realNum)
	                }
                })
		        this.realCount = b

	        },
            //点击确认收货
	        sureConfirm: function () {
	        	let isC = true;
	        	flag:for(let i= 0;i<this.goodsArr.length;i++){
	        		let a = this.goodsArr[i];
			        if(a.isCommon == null){
				        isC = false;
				        break flag;
			        }

		        }
		        if(!isC){
			        Toast({
				        message: '尚有产品未确认,请先完成确认',
			        });
		        }else{
	        		let arr = [];
			        this.goodsArr.forEach(a =>{
				        arr.push({
					        "id": a.id,//skuId
					        "deliveryMemo": a.remark,
					        "replienishStock": a.deliveryNum,//补货数
					        "realReplienishStock": a.realNum//真实补货数
                        })
                    })

			        //将收获的信息发送给java
	        		this.infoToJava(arr) ;
                }
	        },
            infoToJava: function (arr) {
	            let params = {
		            "requestBody":{
			            "replenishmentShelf":{
				            "recordId": localStorage.recordId,//recordId
				            "machineId": localStorage.machineId, //机器id
				            "skuList": arr
			            }
		            },
		            "requestHead":{
			            "token":localStorage.token
		            }
	            };
	            this.$http.post("/replenishment/saveDelivery" , params)
		            .then((res) => {
			            if (res.data.responseHead.code == 200) {
				            let data = res.data.responseBody.data;

				            switch(Number(data.code)) {
					            case 1:
						            this.$router.push({
						               path: '/successView',
						            });
						            break;
					            default :
						            Toast({
							            message: '系统异常',
						            });
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
	        //获取地址栏传参
	        GetQueryString: function(name) {
		        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		        var r = decodeURI(window.location.search).substr(1).match(reg);
		        if(r != null) return unescape(r[2]);
		        return null;
	        },

        },
        mounted: function () {
            //页面初始化
            this.getRestockList();

	        //console.log(this.goodsArr);
        }
	}
</script>

<style scoped>
    @import url('../styles/confirmStyle.css');
    .outbig{
    	width: 100%;
    	overflow-y: scroll;
    	position: absolute;
    	top: 0;
    	bottom: 1.18rem;
    	-webkit-overflow-scrolling: touch;
    }
    .outbig_{
    	height: auto;
    }
</style>
