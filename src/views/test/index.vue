<template>
  <div class="content">
    <div class="head">
      <div class="left">
        <div class="title">
          <i class="icon icon1"></i>今日概况
        </div>
        <div class="cards">
          <div class="card" :key="index" v-for="(item,index) in cards">
            <div class="card-head">
              <span class="account">账号{{item.number}}</span>
              <span class="day">今日</span>
            </div>
            <div class="card-expense">
              <div class="money">
                {{item.expense}}
                <span style="font-size:16px;margin-left:5px; color:#333333;">元</span>
              </div>
              <div class="mark">
                <div class="icon-mark expense">支出</div>
              </div>
            </div>
            <div class="card-income">
              <div class="money">
                {{item.income}}
                <span style="font-size:16px;margin-left:5px; color:#333333;">元</span>
              </div>
              <div class="mark">
                <div class="icon-mark income">收入</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <i class="icon icon2"></i>昨日收入支出
        </div>
        <div class="cards">
          <div class="half half-expense">
            <span class="mark">
              <i class="icon icon3"></i>支出
            </span>￥59,324.00
          </div>
          <div class="half half-income">
            <span class="mark">
              <i class="icon icon4"></i>收入
            </span>￥4321,123,324.00
          </div>
        </div>
      </div>
    </div>
    <div class="middle" v-show="cashconfirm">
      <span class="title">
        <i class="icon icon5"></i>待办事项
      </span>
      <span class="title">
        待付笔数:
        <span class="number">{{totalCount}}</span>
      </span>
      <span class="title">
        待付金额:
        <span class="number">￥{{countTotalAmount}}</span>
      </span>
    </div>
    <div class="tubiao">
      <div class="title">
        <i class="icon icon6"></i>
        <span class="mark">近一月收入支出情况</span>
      </div>
      <ve-line
        class="custom-class"
        :settings="chartSettings"
        height="350px"
        :data="chartData"
        :colors="chartColors"
        :loading="loading"
        :extend="chartExtend"
        :title="title"
      ></ve-line>
    </div>
  </div>
</template>

<script>
import { mapState} from "vuex";
import Dict from "@/util/dict.js";
const ChartData = {
  columns: ["日期", "收入", "支出", "差值"],
  rows: [
    { 日期: "2019-09-26", 收入: 1393, 支出: 2145, 差值: 242 },
    { 日期: "2019-09-27", 收入: 1530, 支出: 2045, 差值: 611 },
    { 日期: "2019-09-28", 收入: 1563, 支出: 2623, 差值: 441 },
    { 日期: "2019-09-29", 收入: 1563, 支出: 1423, 差值: 261 },
    { 日期: "2019-09-30", 收入: 1292, 支出: 1492, 差值: 341 },
    { 日期: "2019-10-01", 收入: 1679, 支出: 1293, 差值: 241 },
    { 日期: "2019-10-02", 收入: 1693, 支出: 1993, 差值: 292 },
    { 日期: "2019-10-03", 收入: 1778, 支出: 1530, 差值: 611 },
    { 日期: "2019-10-04", 收入: 2023, 支出: 1623, 差值: 491 },
    { 日期: "2019-10-05", 收入: 2123, 支出: 1723, 差值: 201 },
    { 日期: "2019-10-06", 收入: 2292, 支出: 1992, 差值: 1041 },
    { 日期: "2019-10-07", 收入: 1993, 支出: 1093, 差值: 298 },
    { 日期: "2019-10-08", 收入: 1763, 支出: 1094, 差值: 123 },
    { 日期: "2019-10-09", 收入: 1710, 支出: 1230, 差值: 611 },
    { 日期: "2019-10-10", 收入: 1323, 支出: 1623, 差值: 401 },
    { 日期: "2019-10-11", 收入: 1313, 支出: 1423, 差值: 231 },
    { 日期: "2019-10-12", 收入: 1342, 支出: 1492, 差值: 341 },
    { 日期: "2019-10-13", 收入: 1533, 支出: 1293, 差值: 241 },
    { 日期: "2019-10-14", 收入: 1593, 支出: 1093, 差值: 292 },
    { 日期: "2019-10-15", 收入: 1630, 支出: 1230, 差值: 411 },
    { 日期: "2019-10-16", 收入: 1723, 支出: 1623, 差值: 711 },
    { 日期: "2019-10-17", 收入: 1823, 支出: 1423, 差值: 521 },
    { 日期: "2019-10-18", 收入: 1992, 支出: 1492, 差值: 490 },
    { 日期: "2019-10-19", 收入: 2093, 支出: 1293, 差值: 281 },
    { 日期: "2019-10-20", 收入: 2123, 支出: 2623, 差值: 441 },
    { 日期: "2019-10-21", 收入: 2223, 支出: 1423, 差值: 211 },
    { 日期: "2019-10-22", 收入: 2431, 支出: 1492, 差值: 256 },
    { 日期: "2019-10-23", 收入: 1232, 支出: 1293, 差值: 134 },
    { 日期: "2019-10-24", 收入: 1223, 支出: 1093, 差值: 432 },
    { 日期: "2019-10-25", 收入: 2231, 支出: 1230, 差值: 123 }
  ]
};

export default {
  name: "test",
  data() {
    this.chartColors = ["#F85757", "#55BB58", "#00ABFF"];
    this.title = {
      textAlign: "left",
      text: "单位:元",
      textStyle: {
        fontSize: 12,
        fontWeight: "normal"
      }
    };

    return {
      // 权限
      countTotalAmount: "暂无",
      totalCount: "暂无",
      cashconfirm: false,
      
      loading: false,
      dataEmpty: true,
      chartData: Object.create(null),
      chartSettings: {
        // yAxisName: ["单位:  万元"]
      },
      chartExtend: null,
      cards: [
        {
          number: "1605",
          income: 245645,
          expense: 344533454343
        },
        {
          number: "1651",
          income: 245645,
          expense: 12132134453
        },
        {
          number: "0396",
          income: 245645,
          expense: 1123123123
        },
        {
          number: "0395",
          income: 245645,
          expense: 1231223425
        }
      ]
    };
  },
  computed:{
    ...mapState("app",["globelPermissionsAuth"])
  },
  methods: {
    async _getCashList() {
      const res = await this.$api.getCashList({ page: 1, pageSize: 10 });
      switch (res.code) {
        case Dict.SUCCESS:
          this.countTotalAmount = res.data.countTotalAmount;
          this.totalCount = res.data.paginator.totalCount;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    perm() {
      this.cashconfirm = this.globelPermissionsAuth.includes("finance:cashconfirm");
    }
  },
  mounted() {
    this.chartExtend = {
      xAxis: {
        show: true
      },
      yAxis: {
        show: true
      },
      legend: {
        show: true
      },
      series: v => {
        Array.from(v).forEach(e => {
          e.smooth = false;
        });
        return v;
      }
    };
    this.loading = true;
    setTimeout(() => {
      this.chartData = ChartData;
      this.loading = false;
      this.dataEmpty = false;
    }, 3000);
    this.perm();
  },
  watch: {
    cashconfirm(newV) {
      if (newV) {
        this._getCashList();
      }
    }
  }
};
</script>

<style scoped lang="less">
.content {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  .head {
    display: flex;
    box-sizing: border-box;
    height: 286px;
    .left {
      width: 1275px;
      display: inline-block;
      background-color: #fff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      .title {
        padding-left: 20px;
        height: 49px;
        line-height: 49px;
        font-size: 12px;
        border-bottom: 1px solid #eee;
        .icon {
          margin-right: 10px;
          display: inline-block;
          vertical-align: sub;
          width: 18px;
          height: 18px;
          &.icon1 {
            background-image: url("./balance.png");
          }
        }
      }
      .cards {
        display: flex;
        .card {
          box-sizing: border-box;
          margin: 20px 10px 20px 10px;
          width: 295px;
          height: 196px;
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          &:first-child {
            margin-left: 20px;
            margin-right: 8px;
          }
          &:last-child {
            margin-left: 8px;
          }
          .card-head {
            height: 45px;
            line-height: 45px;
            background-color: #3b9cf4; /* 不支持线性的时候显示 */
            background-image: linear-gradient(to right, #30d1fd, #4182f0);
            color: #fff;
            font-size: 12px;
            .account {
              margin-left: 10px;
              float: left;
            }
            .day {
              margin-right: 10px;
              float: right;
            }
          }
          .card-expense,
          .card-income {
            height: 75px;
            border-bottom: 1px dashed #eee;
            text-align: center;
            .money {
              float: left;
              width: calc(100% - 50px);
              height: 100%;
              line-height: 74px;
              font-size: 22px;
              color: #444444;
            }
            .mark {
              display: flex;
              align-items: center; /*垂直居中*/
              justify-content: center; /*水平居中*/
              float: right;
              width: 50px;
              height: 100%;
              .icon-mark {
                display: block;
                font-size: 12px;
                width: 35px;
                height: 18px;
                line-height: 18px;
                border-radius: 2px;
                color: #fff;
                &.expense {
                  background-color: #55bb58;
                }
                &.income {
                  background-color: #f85757;
                }
              }
            }
          }
          .card-income {
            box-sizing: border-box;
            border-bottom: 0px;
          }
        }
      }
    }
    .right {
      flex: 1;
      margin-left: 20px;
      display: inline-block;
      background-color: #fff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      .title {
        padding-left: 20px;
        height: 49px;
        line-height: 49px;
        font-size: 12px;
        border-bottom: 1px solid #eee;
        .icon {
          margin-right: 10px;
          display: inline-block;
          vertical-align: sub;
          width: 18px;
          height: 18px;
          &.icon2 {
            background-image: url("./bill.png");
          }
        }
      }
      .cards {
        display: flex;
        box-sizing: border-box;
        height: 236px;
        padding: 20px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        .half {
          flex: 1;
          height: 196px;
          line-height: 196px;
          text-align: center;
          font-size: 22px;
          color: #fff;
          position: relative;
          .mark {
            position: absolute;
            left: 15px;
            top: 15px;
            font-size: 14px;
            height: 25px;
            line-height: 25px;
            .icon {
              display: inline-block;
              vertical-align: text-top;
              width: 24px;
              height: 25px;
              margin-right: 10px;
              &.icon3 {
                background-image: url("./income.png");
              }
              &.icon4 {
                background-image: url("./pay.png");
              }
            }
          }

          &.half-expense {
            background-color: #55bb58;
          }
          &.half-income {
            background-color: #ff6363;
          }
        }
      }
    }
  }
  .middle {
    margin: 15px 0px 0px 0px;
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    background-color: #fff;
    font-size: 0px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    .title {
      display: inline-block;
      font-size: 14px;
      color: #333;
      margin-right: 60px;
      .number {
        font-size: 16px;
        color: #3c8bff;
        letter-spacing: 1.23px;
        margin-left: 10px;
        font-weight: 600;
      }
      .icon {
        display: inline-block;
        vertical-align: text-top;
        width: 18px;
        height: 18px;
        &.icon5 {
          background-image: url("./todo.png");
          margin-right: 10px;
        }
      }
    }
  }
  .tubiao {
    margin: 15px 0px 0px 0px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    .title {
      padding-left: 20px;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dedede;
      font-size: 0px;
      .mark {
        font-size: 14px;
        vertical-align: middle;
      }
      .icon {
        vertical-align: middle;
        margin-right: 10px;
        display: inline-block;
        width: 18px;
        height: 18px;
        &.icon6 {
          background-image: url("./trend.png");
        }
      }
    }
  }
}
</style>