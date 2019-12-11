<template>
  <div
    class="container single-page"
    style="display: block;background-color: white;height: 100%;position:relative"
  >
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="computedHeight">
      <div class="form">
        <el-form ref="form" :model="form" label-width="130px" size="small">
          <div class="form-block">
            <div class="head">基础信息</div>
            <el-row>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="部门">{{receiveform.deptName || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="姓名">{{receiveform.createdName || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="填报日期">{{receiveform.createdTime || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="事由">{{receiveform.title || "-"}}</el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">报销信息</div>
            <el-table :data="receiveform.detailList" v-if="receiveform.detailList && receiveform.detailList.length " stripe border>
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                :width="item.width || 'auto'"
                :align="item.align || 'center'"
                header-align="center"
                :key="index"
                v-for="(item,index) in tableHeader"
              >
                <template slot-scope="scope">
                  <span>{{receiveform.detailList[scope.$index][item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="附件" align="center">
                >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="receiveform.detailList[scope.$index].fileUrlList && receiveform.detailList[scope.$index].fileUrlList.length"
                    @click="openImage(receiveform.detailList[scope.$index])"
                  >点击查看</el-button>
                </template>
              </el-table-column>
            </el-table>   
            <el-row>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="填报费用总金额">{{receiveform.totleMoneny || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="填报费用总税额">{{receiveform.totleTax || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="填报费用金额">{{receiveform.earnMoney || "-"}}</el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">支付信息</div>
            <el-row>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="往来">{{receiveform.comeGo  || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="现金">{{receiveform.comeGo  || "-"}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="银行卡">{{receiveform.comeGo || "-"}}</el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">财务审核</div>
            <el-row>
              <el-col :md="24" :sm="24" :xs="24">
                <el-form-item
                  label="审核结果"
                  prop="status"
                  :rules="[{ required: true, message: '必填' }]"
                >
                  <el-select v-model="form.status" placeholder="请选择" :disabled="reimburseStatus !== Dict.WAIT_ADUIT">
                    <el-option
                      v-for="(item,index) in AuditResultList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="12" :xs="24">
                <el-form-item
                  label="审核意见"
                  prop="remark"
                >
                  <el-input type="textarea" v-model="form.remark"  :disabled="reimburseStatus !== Dict.WAIT_ADUIT"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary"  v-if="reimburseStatus === Dict.WAIT_ADUIT" size="small" :loading="loading" @click="submitForm">确定</el-button>
      <el-button size="small" @click="back">取消</el-button>
    </div>
    <div class="images" style="display:none" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import { mapState, mapMutations } from "vuex";
import Dict from "util/dict.js";
import { deepMerge,DICT_SELECT_ARR } from "common/util";

let copyList = deepMerge(Dict.BITE_STATUS);
delete copyList[Dict.DRAFT]
delete copyList[Dict.WAIT_ADUIT]
const AuditResultList = DICT_SELECT_ARR(copyList);

const defaulttableHeader = [
  {
    prop: "feeFirstName",
    label: "费用科目"
  },
  {
    prop: "feeSecondName",
    label: "会计科目"
  },
  {
    prop: "isTaxName",
    label: "发票类型"
  },
  {
    prop: "sbTotleMoney",
    label: "总金额"
  },
  {
    prop: "sbTax",
    label: "税额"
  },
  {
    prop: "srTotleMoney",
    label: "实际总金额"
  },
  {
    prop: "srTax",
    label: "实际税额"
  },
  {
    prop: "sbMoney",
    label: "金额"
  }

];

const defualtFormParams = {
  status: null,
  remark:null // 备注
};

export default {
  name: "auditReimburse",
  data() {
    return {
      loading: false,
      form: {...defualtFormParams},
      tableHeader: defaulttableHeader,
      Dict,

      AuditResultList,

      images: [],
      disabled: false,
      receiveform:Object.create(null)
    };
  },
  computed: {
    ...mapState("reimburse", ["reimburseStatus", "reimburseId"]),
    breadTitle() {
      const Text = this.reimburseStatus === Dict.WAIT_ADUIT ? "审核" : "查看";
      return ["报销中心", "报销管理", `报销${Text}`];
    }
  },
  methods: {
    ...mapMutations('reimburse',["setReimburseId","setReimburseStatus"]),
    back() {
      this.$router.push({
        path: "/web/expense/detail/pageSH"
      });
    },
    _filter() {
      let params = deepMerge(this.form);
      params.id = this.reimburseId;
      return params;
    },
    async _getReimburseDetail() {
      const res = await this.$api.getReimburseDetail(this.reimburseId);
      switch (res.code) {
        case Dict.SUCCESS:
          this.form.remark = res.data.remark;
          if(res.data.status === Dict.BACK_ADUIT || res.data.status === Dict.ENTER_ADUIT ) {
             this.form.status = res.data.status;
          }
          this.receiveform = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    submitForm() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = that._filter();
          that._updateReimburse_(params);
        } else {
          return false;
        }
      });
    },
    async _updateReimburse_(params) {
      this.loading = true;
      const res = await this.$api.updateReimburse(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("更新成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    openImage(item) {
      this.images = item.fileUrlList.map(item => item.fileUrl);
      setTimeout(() => {
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
      }, 500);
    }
  },
  mounted() {
    if(!this.reimburseId){
      this.back();
    }
    if(this.reimburseStatus === Dict.DRAFT) {
      this.back();
    }
    this._getReimburseDetail();
  },
  destroyed(){
    this.setReimburseId(null);
    this.setReimburseStatus(Dict.DRAFT);
  }
};
</script>

<style scoped lang="less">
.amap-demo {
  height: 300px;
}

.computedHeight {
  height: calc(100% - 101px);
  overflow: auto;
  .form {
    .form-block {
      padding: 20px;
      .head {
        margin-bottom: 20px;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333333;
        background: #f6f8fa;
      }
      .uploadDeal {
        margin-top: 10px;
        font-size: 12px;
        color: #909399;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px dashed #eee;
        &:hover {
          color: #ff0000;
          cursor: pointer;
        }
      }
    }
  }
}

.bottom {
  position: absolute;
  left: 0px;
  right: 40px;
  bottom: 20px;
  height: 50px;
  background-color: #f6f8fa;
  margin-left: 20px;
  box-shadow: 0 -1px 4px 0 hsla(0, 0%, 80%, 0.5);
  .el-button {
    min-width: 64px;
    margin-left: 20px;
    margin-top: 10px;
    &:last-child {
      margin-left: 16px;
    }
  }
}
</style>

    