<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="ruleForm"
  >
    <el-form-item label="队伍名称" prop="name" required>
      <el-input class="input" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="队伍头像" prop="type">
      <el-upload
        ref="upload"
        class="upload-demo team-avatar"
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
    <el-form-item label="是否公开">
      <el-switch v-model="ruleForm.isopen"></el-switch>
    </el-form-item>
    <el-form-item label="参赛赛事" prop="type">
      <el-select v-model="ruleForm.comps" collapse-tags filterable multiple placeholder="支持搜索">
        <el-option
          v-for="item in compOptions"
          :key="item.comp_id"
          :label="item.title"
          :value="item.comp_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="成员" prop="type">
      <el-select v-model="ruleForm.users" clearable collapse-tags filterable multiple placeholder="搜索或选择...">
        <el-option
          v-for="item in userOptions"
          :key="item.user_id"
          :label="item.username"
          :value="item.user_id"
          
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="ruleForm.users.length >0 " label="队长" prop="type">
      <el-select v-model="ruleForm.leader" size="medium" clearable autocomplete collapse-tags filterable placeholder="搜索或选择..." >
        <el-option
          v-for="item in userOptions"
          :key="item.user_id"
          :label="item.username"
          :value="item.user_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="队伍介绍" prop="desc">
      <el-input style="width:80%;" type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{type == 0?'新建队伍':'编辑队伍'}}</el-button>
      <!-- <el-button @click="resetForm('ruleForm')"></el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompetitionList } from '@/api/competition'
import { editTeam, postTeam, fetchTeamDetail} from '@/api/team'
import { getUserList} from '@/api/user'
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
        name: '',
        imgUrl: '',
        comps: [],
        leader: '',
        users: [],
        desc: '',
        isopen: 0
      },
      type: 0, //0新建1编辑
      imgList: [],
      compOptions: [],
      userOptions: [],
      menberOptions:[],
      rules: {
        name: [
          { required: true, message: '请输入队伍名称', trigger: 'blur' },
          { min: 4, message: '长度至少为4个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写队伍介绍', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query.team_id) {
      this.type = 1
      this.$route.meta.title = '编辑队伍'
      fetchTeamDetail(this.$route.query.team_id).then(res =>{
        this.ruleForm.name = res.data.team_name
        this.ruleForm.imgUrl = res.data.team_avatar_url
        this.ruleForm.isopen = res.data.team_isOpen
        this.ruleForm.desc = res.data.team_intro
        res.data.competitions.forEach((e,i)=>{
          this.ruleForm.comps.push(e.comp_id)
        })
        res.data.users.forEach((e,i)=>{
          if(e.team_user.position == 1)
            this.ruleForm.leader = e.user_id
          this.ruleForm.users.push(e.user_id)
        })

        console.log(this.ruleForm.users)
        // this.ruleForm.tags = res.data.content

        console.log(this.ruleForm)
      })
    }
    // this.ruleForm.name='挑战杯大赛'
    // this.ruleForm.sponsor='挑战杯大赛11'
    // this.ruleForm.degree=2
    // this.ruleForm.desc='挑战杯大赛'
    getCompetitionList(0).then(res => {
      this.compOptions = res.data
    })
    getUserList(0).then(res => {
      this.userOptions = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          
          let leader_in = 0
          console.log(this.ruleForm.leader)
          for(let i=0;i<this.ruleForm.users.length; i++) {
            if(this.ruleForm.leader == this.ruleForm.users[i])
              leader_in =1
          }
           console.log(this.ruleForm.leader)
          if (this.ruleForm.imgUrl === '' || this.ruleForm.leader === '' || leader_in == 0 ) {
            this.$message({
              message: '失败！',
              type: 'error'
            })
            return false
            }
          if(this.type == 0) {
            postTeam(this.ruleForm).then(res =>{
              this.$message({
                message: '新增队伍成功！',
                type: 'success'
              })
              this.$router.push('/team/list')
            })
          } else {
            editTeam(this.$route.query.team_id,this.ruleForm).then(res =>{
              this.$message({
                message: '编辑队伍成功！',
                type: 'success'
              })
              this.$router.push('/team/list')
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
.team-avatar .el-upload-dragger {
    width: 200px !important;
    height: 200px !important;
    }
</style>
