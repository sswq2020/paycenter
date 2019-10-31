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
                {{$numFormatter(item.expense)}}
                <span style="font-size:16px;margin-left:5px; color:#333333;">元</span>
              </div>
              <div class="mark">
                <div class="icon-mark expense">支出</div>
              </div>
            </div>
            <div class="card-income">
              <div class="money">
                {{$numFormatter(item.income)}}
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
            </span>
            ￥{{$numFormatter(lastDayExpense)}}
          </div>
          <div class="half half-income">
            <span class="mark">
              <i class="icon icon4"></i>收入
            </span>
            ￥{{$numFormatter(lastDayIncome)}}
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
        <span class="number">￥{{$numFormatter(countTotalAmount)}}</span>
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
import { mapState } from "vuex";
import Dict from "@/util/dict.js";
const defaultColumns = ["日期", "收入", "支出", "差值"];

export default {
  name: "test",
  data() {
    this.chartColors = ["#F85757", "#55BB58", "#00ABFF"];
    this.title = {
      textAlign: "left",
      text: "单位: 万元",
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
      chartData: Object.create(null),
      chartSettings: {
      //  yAxisType: ['KMB'],
      },
      chartExtend: null,
      cards: new Array(4).fill({
        number: "暂无",
        income: 0,
        expense: 0
      }),
      lastDayExpense: 0,
      lastDayIncome: 0
    };
  },
  computed: {
    ...mapState("app", ["globelPermissionsAuth"])
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
    async _todaySituationData() {
      const res = await this.$api.todaySituationData();
      switch (res.code) {
        case Dict.SUCCESS:
          if (res.data.accFlowSituVos && res.data.accFlowSituVos.length) {
            let list = res.data.accFlowSituVos;
            list = list.map(item => {
              const { inTotalAmt, outTotalAmt, bankAccountVo } = item;
              const { shortName } = bankAccountVo;
              return {
                number: shortName,
                income: inTotalAmt,
                expense: outTotalAmt
              };
            });
            this.cards = list;
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _yesterdaySituationData() {
      const res = await this.$api.yesterdaySituationData();
      switch (res.code) {
        case Dict.SUCCESS:
          this.lastDayExpense = res.data.outTotalAmt || "暂无";
          this.lastDayIncome = res.data.inTotalAmt || "暂无";
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _lastMonthSituationData() {
      this.loading = true;
      const res = await this.$api.lastMonthSituationData();
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          if (res.data && res.data.length) {            
            let list = res.data;
            list = list.map((item) => {
              const { inTotalAmt, outTotalAmt,date } = item;
              return {
                [defaultColumns[0]]: date,
                [defaultColumns[1]]: inTotalAmt / 10000,
                [defaultColumns[2]]: outTotalAmt / 10000,
                [defaultColumns[3]]: Math.abs(inTotalAmt - outTotalAmt) / 10000
              };
            });
            this.chartData = Object.assign({},{columns:defaultColumns},{rows:list})
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    perm() {
      this.cashconfirm = this.globelPermissionsAuth.includes(
        "finance:cashconfirm"
      );
    }
  },
  mounted() {
    this._todaySituationData()
    .then(()=>{
      this._yesterdaySituationData()
    })
    .then(()=>{
      this._lastMonthSituationData();
    })


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