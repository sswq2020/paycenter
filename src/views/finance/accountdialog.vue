<template>
  <el-dialog :show-close="false" :title="title" :visible="accountdialog" width="600px">
    <el-form
      :model="bankAccountParams"
      :rules="rules"
      ref="ruleForm"
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="开户银行" prop="ubankNo">
        <el-select style="width:100%" v-model="bankAccountParams.ubankNo">
          <el-option
            v-for="item in bankDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户简称" prop="shortName">
        <el-input v-model="bankAccountParams.shortName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户名" prop="accName">
        <el-input v-model="bankAccountParams.accName"></el-input>
      </el-form-item>
      <el-form-item label="银行账户号" prop="accNo">
        <el-input v-model="bankAccountParams.accNo"></el-input>
      </el-form-item>

      <el-form-item label="开户支行/分理处" prop="branchName">
        <el-input v-model="bankAccountParams.branchName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="isAccountLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { dictMixin } from "@/common/mixin.js";
export default {
  name: "accountdialog",
  mixins: [dictMixin],
  props: {},
  data() {
    return {
      rules: {
        shortName: [
          { required: true, message: "请输入账户简称", trigger: "blur" }
        ],
        accName: [
          { required: true, message: "请输入银行账户名", trigger: "blur" }
        ],
        accNo: [{ required: true, message: "银行账户号", trigger: "blur" }],
        ubankNo: [
          { required: true, message: "请选择开户银行", trigger: "blur" }
        ],

        branchName: [
          { required: true, message: "开户支行/分理处", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState("accountinfomanage", [
      "bankAccountParams",
      "isEdit",
      "accountdialog",
      "isAccountLoading"
    ]),
    title() {
      return this.isEdit ? "编辑账户" : "新增账户";
    }
  },
  methods: {
    ...mapMutations("accountinfomanage", ["setAccountdialog"]),
    ...mapActions("accountinfomanage", ["updateBankAccount"]),
    open() {
      this.setAccountdialog(true);
    },
    cancle() {
      this.setAccountdialog(false);
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let parmas = JSON.parse(JSON.stringify(that.bankAccountParams));
          const { ubankNo } = parmas;
          const index = that.bankDict.findIndex(item => {
            return item.value === ubankNo;
          });
          parmas.bankName = that.bankDict[index].label;
          this.updateBankAccount(parmas);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    accountdialog(newV, oldV) {
      if (newV === false) {
        this.$refs.ruleForm.clearValidate();
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
