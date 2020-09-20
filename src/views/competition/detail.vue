<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="ruleForm"
  >
    <el-form-item label="赛事名称" prop="name" required>
      <el-input class="input" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="主办方" prop="name" required>
      <el-input class="input" v-model="ruleForm.sponsor"></el-input>
    </el-form-item>
    <el-form-item label="赛事等级" prop="degree" required>
      <el-select v-model="ruleForm.degree" placeholder="请选择赛事等级">
        <el-option label="校级" value="0"></el-option>
        <el-option label="省级" value="1"></el-option>
        <el-option label="国家级" value="2"></el-option>
        <el-option label="国际级" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="赛事日期" required>
      <el-col :span="4">
        <el-form-item prop="startDate" :span="2">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width:100%;"
          />
        </el-form-item>
      </el-col>
      <el-col class="line" :span="1">——</el-col>
      <el-col :span="4">
        <el-form-item prop="endDate" required>
          <el-date-picker
            v-model="ruleForm.endDate"
            placeholder="选择结束日期"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="赛事图片" prop="type">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :action="importFileUrl"
        :headers="uploadFileHeaders"
        :on-success="uploadSuccess"
        multiple
        :limit="1"
      >
        <div v-if="ruleForm.imgUrl">
          <img :src="ruleForm.imgUrl" alt="">
        </div>
        <div v-else>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="赛事标签" prop="type">
      <el-select v-model="ruleForm.tags" collapse-tags filterable multiple placeholder="支持搜索">
        <el-option
          v-for="item in tagOptions"
          :key="item.tag_id"
          :label="item.tag_name"
          :value="item.tag_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="赛事介绍" prop="desc">
      <el-input style="width:80%;" type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">新建赛事</el-button>
      <!-- <el-button @click="resetForm('ruleForm')"></el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTagList } from '@/api/tag'
import { postCompetition } from '@/api/competition'
export default {
  computed: {
    ...mapGetters([
      'token'
    ]),
    uploadFileHeaders() {
      return {
        'X-Token': this.token
      }
    },
  },
  data() {
    return {
      importFileUrl: 'http://localhost:5757/api/upload',
      ruleForm: {
        name: '',
        sponsor:'',
        degree: '',
        imgUrl: '',
        startDate:'',
        endDate:'',
        tags: [],
        desc: ''
      },
      imgList: [],
      tagOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入赛事名称', trigger: 'blur' },
          { min: 4, message: '长度至少为4个字符', trigger: 'blur' }
        ],
        sponsor: [
          { required: true, message: '请输入主办方', trigger: 'blur' }
        ],
        degree: [
          { required: true, message: '请选择等级', trigger: 'blur' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写赛事介绍', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.ruleForm.name='挑战杯大赛'
    this.ruleForm.sponsor='挑战杯大赛11'
    this.ruleForm.degree=2
    this.ruleForm.desc='挑战杯大赛'
    getTagList(0).then(res => {
      this.tagOptions = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.imgUrl === '' || this.ruleForm.tags.length === 0) return false
          postCompetition(this.ruleForm)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    uploadSuccess(res,file,fileList) {
      this.ruleForm.imgUrl = res.data
      console.log(res)
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
