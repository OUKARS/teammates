<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="ruleForm"
  >
    <el-form-item label="赛事标签" prop="name">
      <el-input class="input" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">新建标签</el-button>
      <!-- <el-button @click="resetForm('ruleForm')"></el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { postTag} from '@/api/tag'
export default {
  data() {
    return {
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 4, message: '长度在至少为4个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postTag(this.ruleForm.name).then(res => {
            this.$message({
              message: '新增标签成功！',
              type: 'success'
            })
            this.ruleForm.name = ''
          })
        } else {
          console.log('error submit!!')
          return false
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.ruleForm{
  margin: 20px 0;
  .input{
    width:50%;
  }
}
.line{
  text-align: center;
}
</style>
