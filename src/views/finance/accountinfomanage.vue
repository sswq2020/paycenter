<template>
  <div class="container single-page" style="height:100%">
    <hlBreadcrumb :data="breadTitle">
      <el-button class="hlB_buts" v-if="addAccount"  size="small" icon="el-icon-plus" @click="add">新增</el-button>
    </hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>账户简称</label>
        <div class="form-control">
          <el-input v-model="listParams.shortName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>账户号</label>
        <div class="form-control">
          <el-input v-model="listParams.accNo" placeholder="请输入" size="small"></el-input>
        </div>
      </div>

      <div class="form-item">
        <el-button
          type="primary"
          v-loading.fullscreen.lock="isListDataLoading"
          @click="getListData"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <div class="card-wrapper">
      <div class="bankcard" v-for="(item,index) in listData.list" :key="item.accountId">
        <div class="bank-content" @click.stop="detail(item)">
          <div class="shortName">{{item.shortName}}</div>
          <div class="balance">{{item.hideFinance ? $numFormatter(item.balance) : '******'}}元</div>
          <div class="accNo">{{item.accNo}}</div>
          <div class="eye" v-if="reBalance" @click.stop="handle(item,index)">
            <span :class="showHide(item.hideFinance)"></span>
          </div>
        </div>
        <div class="bank-operate">
          <div class="op operate-detail" v-if="canfinddetail" @click.stop="account(item)">交易明细</div>
          <div class="op operate-detail" v-if="editAccount"  @click.stop="edit(item)">编辑</div>
          <div class="op" v-if="delAccount" @click.stop="deleted(item.accountId)">删除</div>
        </div>
      </div>
    </div>
    <div class="page-wrapper">
      <el-pagination
        class="page"
        background
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="listParams.page"
        :page-sizes="[5,10]"
        :page-size="listParams.pageSize"
        layout="total, prev, pager, next,sizes, jumper"
        :total="listData.paginator.totalCount"
      ></el-pagination>
    </div>
    <bankdetaildialog ref="bankdetaildialog" :title="title">
      <div
        class="info"
        style="font-size:20px;font-weight:600;margin-top:0"
      >{{bankInfoDetail ? bankInfoDetail.shortName : ''}}</div>
      <div class="info">{{bankInfoDetail ? bankInfoDetail.accName: ''}}</div>
      <div class="info">{{bankInfoDetail ? bankInfoDetail.bankName: ''}}</div>
      <div class="info">{{bankInfoDetail ? bankInfoDetail.branchName: ''}}</div>
      <div class="info">{{bankInfoDetail ? bankInfoDetail.accNo: ''}}</div>
    </bankdetaildialog>
    <accountdialog ref="accountdialog"></accountdialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { judgeAuth, filterProps} from "@/util/util.js";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import bankdetaildialog from "./bankdetaildialog.vue";
import accountdialog from "./accountdialog.vue";

export default {
  name: "accountinfomanage",
  components: {
    hlBreadcrumb,
    bankdetaildialog,
    accountdialog
  },
  data() {
    return {
      breadTitle: ["财务中心", "银行账户管理"],
      title: "查看账户",
      /***权限***/
      addAccount:false,
      editAccount:false,
      delAccount:false,
      reBalance:false,
      canfinddetail:false,
    };
  },
  computed: {
    ...mapState("accountinfomanage", [
      "isListDataLoading",
      "listParams",
      "listData",
      "bankInfoDetail",
      "bankAccountParams"
    ])
  },
  methods: {
    ...mapMutations("accountinfomanage", [
      "setBankInfoDetail",
      "setAccountdialog",
      "setListDataHide"
    ]),
    ...mapMutations("accountTradeDetails", [
      "setBankAccountInfoDetail",
    ]),    
    ...mapActions("accountinfomanage", [
      "getListData",
      "clearListParams",
      "changePage",
      "changePageSize",
      "deleteBankAccount",
      "refreshBalance",
      "openAddAccountDialog",
      "openEditAccountDialog"
    ]),
    sizeChange(size) {
      this.changePageSize(size);
    },
    pageChange(page) {
      this.changePage(page);
    },
    deleted(id) {
      let that = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.deleteBankAccount({id});
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    detail(item) {
      this.setBankInfoDetail(item);
      this.$refs.bankdetaildialog.open();
    },
    account(item) {
      let obj = filterProps(item,{...this.bankAccountParams,balance:item.balance || 0})
      this.setBankAccountInfoDetail(obj);
      this.$router.push({
        path: `/finance/accountTradeDetails`
      });
    },
    add() {
      this.openAddAccountDialog();
    },
    edit(item) {
      let obj = filterProps(item,this.bankAccountParams)
      this.openEditAccountDialog(obj);
    },
    handle(item,index){
      if(item.hideFinance) { // 已经显示了隐藏，不必再操作
        this.setListDataHide({hideFinance:false,index})
      }else{
        const id = item.accountId;
        this.refreshBalance({id,index});
      }
    },
    showHide(hideFinance){
      return hideFinance ? 'icon-open' : 'icon-close'
    },
    init() {
      setTimeout(() => {
        this.perm();
        this.getListData();
      }, 50);
      this.perm();
    },
    perm() {
      this.addAccount=judgeAuth("finance:accountinfomanage:add");
      this.editAccount=judgeAuth("finance:accountinfomanage:edit");
      this.delAccount=judgeAuth("finance:accountinfomanage:del");
      this.reBalance=judgeAuth("finance:accinfo:refreshBalance");
      this.canfinddetail=judgeAuth("finance:billDetail:getBillDeta");
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.search-box {
  margin: 0;
  .form-item {
    padding-top: 20px;
    .el-button {
      margin-top: 17px;
    }
  }
}

.card-wrapper {
  box-sizing: border-box;
  display: flex;
  padding: 30px 15px;
  height: calc(100% - 120px - 54px);
  overflow: hidden;
  flex-wrap: wrap;
  .bankcard {
    box-sizing: border-box;
    margin: 10px 20px;
    width: 300px;
    height: 188px;
    .bank-content {
      background: url(./bankcard.png) no-repeat;
      height: 148px;
      width: 300px;
      position: relative;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 1px;
      .shortName {
        position: absolute;
        left: 84px;
        bottom: 97px;
      }
      .balance{
        position: absolute;
        left: 84px;
        bottom: 73px;
        color: #ffd833;
        line-height:19px;
        letter-spacing: 1px
      }
      .eye{
        position: absolute;
        width:20px;
        height:20px;
        line-height: 20px;
        right: 70px;
        bottom: 73px;
        .icon-open{
          display: inline-block;
          width:20px;
          height: 20px;
          background: url("./el-icon-open.png") no-repeat
        }
        .icon-close{
          display: inline-block;
          width:20px;
          height: 20px;
          background: url("./el-icon-close.png") no-repeat
        }        
      }
      .accNo {
        position: absolute;
        left: 28px;
        bottom: 36px;
        font-size: 18px;
        letter-spacing: 2px;
      }
    }
    .bank-operate {
      box-sizing: border-box;
      display: flex;
      height: 40px;
      line-height: 35px;
      padding: 5px 0px;
      text-align: center;
      font-size: 14px;
      border-radius: 0px 0px 7px 7px;
      background: #f4f4f4;
      box-shadow: 5px 5px 5px #888888;
      cursor:pointer;
      .op {
        flex: 1;
        &.operate-detail {
          border-right: solid 1px #eee;
        }
      }
    }
  }
}
.page-wrapper {
  height: 34px;
  box-sizing: border-box;
  background-color: #f6f8fa;
  position: relative;
  margin: 0px 20px 20px 20px;
  .page {
    display: block;
    position: absolute;
    top: 1px;
    right: 10px;
  }
}

.info {
  margin: 0px 10px 20px 20px;
  font-size: 18px;
  height: 20px;
  line-height: 20px;
}
.tip {
  margin: 10px 0 20px 0;
}
</style>

