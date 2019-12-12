<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>部门</label>
        <div class="form-control">
          <treeSelect
            class="tree-select"
            ref="treeSelect"
            :data="departments"
            :defaultProps="defaultProps"
            :nodeKey="nodeKey"
            :checkedKeys="defaultCheckedKeys"
            @popoverHide="popoverHide"
          ></treeSelect>
        </div>
      </div>
      <div class="form-item">
        <label>姓名</label>
        <div class="form-control">
          <el-input v-model="form.createdName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>提交日期</label>
        <div class="form-control">
          <el-date-picker
            v-model="form.timeRange"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="form-item">
        <label>报销状态</label>
        <div class="form-control">
          <el-select v-model="form.status" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in BiteStatustList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <el-button
          type="primary"
          :loading="isListDataLoading"
          @click="getListDataBylistParams"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <HletongTable
      ref="tb"
      @sizeChange="changePageSize"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :loading="isListDataLoading"
    >
      <el-table-column
        :align="item.align || 'left'"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px" align='left'>
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="listData.list[scope.$index].status === Dict.WAIT_ADUIT"
            @click="todo(listData.list[scope.$index])"
          >审核</el-button>
          <el-button
            type="text"
            v-if="listData.list[scope.$index].status !== Dict.WAIT_ADUIT"
            @click="find(listData.list[scope.$index])"
          >查看</el-button>
        </template>
      </el-table-column>
    </HletongTable>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { requestParamsByTimeRange, DICT_SELECT_ARR,deepMerge } from "common/util.js";
import _ from "lodash";
import Dict from "util/dict.js";
import moment from 'moment';
import treeSelect from "components/treeSelect";

let copyList = deepMerge(Dict.BITE_STATUS);
delete copyList[Dict.DRAFT]
const BiteStatustList = DICT_SELECT_ARR(copyList);

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ["startTime", "endTime"];

const defaultFormData = {
  deptid: null,
  createdName: null,
  timeRange: [],
  status: Dict.WAIT_ADUIT
};
const defaultListParams = {
  pageSize: 20,
  page: 1
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};
const defaulttableHeader = [
  {
    prop: "createdTimeText",
    label: "提交时间"
  },
  {
    prop: "deptName",
    label: "部门"
  },
  {
    prop: "createdName",
    label: "姓名"
  },
  {
    prop: "totleMoneny",
    label: "填报费用总金额",
    align: "right"
  },
  {
    prop: "totleTax",
    label: "填报费用总税额",
    align: "right"
  },
  {
    prop: "statusName",
    label: "报销状态"
  }
];

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        createdTimeText: `${moment(Number(row.createdTime)).format("YYYY-MM-DD HH:mm:ss")}`,
      });
    });
  }
  return list;
};

export default {
  name: "reimbursemanage",
  components: {
    treeSelect
  },
  data() {
    return {
      breadTitle: ["报销中心", "报销管理"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      Dict,
      BiteStatustList,

      // 树组件相关
      departments: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      nodeKey: "id",
      defaultCheckedKeys: []
    };
  },
  methods: {
    ...mapMutations('reimburse',["setReimburseId","setReimburseStatus"]),
    _filter() {
      const { timeRange } = this.form;
      const _reqParams_ = requestParamsByTimeRange(
        this.form,
        timeRange,
        ...EXTRA_PARAMS_KEYS
      );
      return _.clone(Object.assign({}, _reqParams_, this.listParams));
    },
    clearListParams() {
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };

      if (this.$refs.treeSelect) {
        this.$refs.treeSelect.clear();
      }

      this.getListData();
    },
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    changePageSize(pageSize) {
      this.listParams = { ...defaultListParams, pageSize: pageSize };
      this.getListData();
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      let obj = this._filter();
      this.isListDataLoading = true;
      const res = await this.$api.reimburseManagePage(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = { ...res.data, list: rowAdapter(res.data.list) };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    popoverHide(depId) {
      this.form.deptid = depId;
    },
    /***获取部门下拉**/
    async _getOriginzationList() {
      const res = await this.$api.getOriginzationList();
      switch (res.code) {
        case Dict.SUCCESS:
          res.data[0].disabled = true;
          for (let i = 0; i < res.data[0]["children"].length; i++) {
            res.data[0]["children"][i].disabled = true;
          }
          this.departments = res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    goto() {
      this.$router.push({
        path: "/web/expense/detail/audit"
      });
    },
    todo(item){
      const {id,status} = item
      this.setReimburseId(id);
      this.setReimburseStatus(status);
      this.goto();
    },
    find(item){
      const {id,status} = item
      this.setReimburseId(id);
      this.setReimburseStatus(status);
      this.goto();
    },
    init() {
      setTimeout(() => {
        this.clearListParams();
        this._getOriginzationList();
        this.perm();
      }, 20);
      this.perm();
    },
    perm() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.search-box {
  flex-wrap: wrap;
  margin: 0;
  .form-item {
    padding-top: 20px;
    .el-button {
      margin-top: 17px;
    }
  }
}
</style>
