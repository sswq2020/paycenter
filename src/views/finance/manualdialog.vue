<template>
  <el-dialog
    :close-on-click-modal="false"
    width="400px"
    :visible.sync="manualdialog"
    :center="true"
    title="人工确认"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="确认此单据状态">
        <el-select v-model="form.status" @change="change" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="凭证号" prop="creditNo">
        <el-input v-model="form.creditNo" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="审核意见">
        <el-input type="textarea" v-model="form.memo" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setTimeout } from 'timers';
const defaultParams = {
  memo: null,
  status: 1,
  creditNo: null
};
const RULE1 = {
  creditNo: [
    { required: true, message: "请输入凭证号", trigger: "blur" },
    { max: 12, message: "长度最大为12个字符", trigger: "blur" }
  ]
};

const RULE2 = {
  creditNo: [
    { max: 12, message: "长度最大为12个字符", trigger: "blur" }
  ]
};
export default {
  name: "manualdialog",
  props:{
    creditNo:{
      type: String,
      default: ""      
    }
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "转账失败"
        },
        {
          value: 1,
          label: "转账成功"
        }
      ],
      manualdialog: false,
      form: { ...defaultParams },
      rules:RULE1
    }
  },
  methods: {
    open() {
      this.manualdialog = true;
    },
    cancle() {
      this.manualdialog = false;
    },
    change(value){
      this.rules = value === 1 ? RULE1 : RULE2;
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.$emit("confirm", that.form);
          that.manualdialog = false;
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    manualdialog(newV) {
      if (newV === false) {
        this.rules = RULE1;
        this.form = { ...defaultParams };
        setTimeout(()=>{
           this.$refs.ruleForm.resetFields();
        },50)
      }else {
        this.form.creditNo = this.creditNo;
      }
    }
  }  
};
</script>
<style scoped lang="less">
</style>
