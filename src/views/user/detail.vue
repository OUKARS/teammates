<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="ruleForm"
  >
    <el-form-item label="用户账号" prop="username" required>
      <el-input class="input" v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item v-if="type == 0" label="用户密码" prop="password" required>
      <el-input class="input" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="用户昵称" prop="name" required>
      <el-input class="input" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="telephone">
      <el-input class="input" v-model="ruleForm.telephone"></el-input>
    </el-form-item>
    <el-form-item label="QQ" prop="qq">
      <el-input class="input" v-model="ruleForm.qq"></el-input>
    </el-form-item>
    <el-form-item label="微信" prop="wechat">
      <el-input class="input" v-model="ruleForm.wechat"></el-input>
    </el-form-item>
    <el-form-item label="用户头像" prop="type">
      <el-upload
        ref="upload"
        class="upload-demo user-avatar"
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
    <el-form-item label="性别">
      <el-switch v-model="ruleForm.gender"></el-switch>{{ruleForm.gender == 0?'男':'女'}}
    </el-form-item>
    <el-form-item label="参与队伍">
       <el-tag v-for="item in ruleForm.teams" :key="item.team_id" style="margin:2px 4px;!important" size="medium">{{ item.team_name }}</el-tag>
    </el-form-item>
    <el-form-item label="用户介绍" prop="desc">
      <el-input style="width:80%;" type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{type == 0?'新建用户':'编辑用户'}}</el-button>
      <!-- <el-button @click="resetForm('ruleForm')"></el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchUserDetail, postUser, editUser } from '@/api/user'
import { getTeamList} from '@/api/team'
export default {
  computed: {
    ...mapGetters([
      'token',
      'importFileUrl'
    ]),
    uploadFileHeaders() {
      return {
        'X-Token': this.token
      }
    },
  },
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
        name: '',
        imgUrl: '',
        desc: '',
        teams: [],
        gender: 0,
        telephone:'',
        qq:'',
        wechat:''
      },
      type: 0, //0新建1编辑
      imgList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 4, message: '长度至少为4个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写用户密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 4, message: '长度至少为4个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写用户介绍', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query.user_id) {
      this.type = 1
      this.$route.meta.title = '编辑用户'
      fetchUserDetail(this.$route.query.user_id).then(res =>{
        this.ruleForm.username = res.data.username
        this.ruleForm.name = res.data.user_name
        this.ruleForm.imgUrl = res.data.avatar_url
        this.ruleForm.gender = res.data.gender
        this.ruleForm.desc = res.data.user_intro
        this.ruleForm.telephone = res.data.telephone
        this.ruleForm.qq = res.data.qq
        this.ruleForm.wechat = res.data.wechat
        res.data.teams.forEach((e,i)=>{
          this.ruleForm.teams.push(e)
        })
        // this.ruleForm.tags = res.data.content

        console.log(this.ruleForm)
      })
    }
    // this.ruleForm.name='挑战杯大赛'
    // this.ruleForm.sponsor='挑战杯大赛11'
    // this.ruleForm.degree=2
    // this.ruleForm.desc='挑战杯大赛'
    getTeamList(0).then(res => {
      this.teamOptions = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.imgUrl === '') return false
          if (this.type == 0) {
            postUser(this.ruleForm).then(res =>{
              this.$message({
                message: '新增用户成功！',
                type: 'success'
              })
              this.$router.push('/user/list')
            })
          } else {
            editUser(this.$route.query.user_id, this.ruleForm).then(res => {
              this.$message({
                message: '编辑用户成功！',
                type: 'success'
              })
              this.$router.push('/user/list')
            })
          }
          
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

<style lang="scss">
.ruleForm{
  margin: 20px 0;
  .input{
    width:50%;
  }
}
.line{
  text-align: center;
}

.upload-demo{
  min-height: 200px;
  height: auto;
    img{
    width:100%;
    height:auto;
    }
}
.user-avatar .el-upload-dragger {
    width: 200px !important;
    height: 200px !important;
    }
</style>
