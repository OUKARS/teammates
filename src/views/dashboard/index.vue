<template>
  <div class="dashboard-container">
    <div class="dashboard-text">进行中：</div>
    <div class="list-container">
      <div v-for="item in nowlist" :key="item.comp_id" class="list-card" @click="opendialog(item)">
        <div class="degree">{{item.degree == 0? '校级':item.degree == 1?'省级':item.degree == 2?'国家级':'国际级'}}</div>
        <div class="img-container">
          <img class="comp_img" :src="item.img_url" alt="">
        </div>
        <div class="content">
          <div class="title">{{item.title}}</div>
          <div class="desc">{{item.content}}</div>
        </div>
        <div class="tag-container">
          <div  v-for="tag in item.tags" :key="tag.tag_id" class="tag">{{tag.tag_name}}</div>
        </div>
      </div>
    </div>
    <div class="dashboard-text">已结束：</div>
    <div class="list-container">
      <div v-for="item in outlist" :key="item.comp_id" class="list-card" @click="opendialog(item)">
        <div class="degree">{{item.degree == 0? '校级':item.degree == 1?'省级':item.degree == 2?'国家级':'国际级'}}</div>
        <div class="img-container">
          <img class="comp_img" :src="item.img_url" alt="">
        </div>
        <div class="content">
          <div class="title">{{item.title}}</div>
          <div class="desc">{{item.content}}</div>
        </div>
        <div class="tag-container">
          <div  v-for="tag in item.tags" :key="tag.tag_id" class="tag">{{tag.tag_name}}</div>
        </div>
      </div>
    </div>
    <el-dialog
      title="赛事队伍"
      :visible.sync="dialogVisible"
      width="64%"
      :before-close="handleClose">
      <div class="dialog-content">
         <div class="title">{{selectItem.title}}  -------  <span v-if="selectItem.teams">共有{{selectItem.teams.length}}支队伍</span></div>
        <div class="team-container">
          <div v-for="item in selectItem.teams" :key="item.team_id" class="team">
            <div class="avatar-container" @click="jumpToTeam(item)">
              <img class="avatar-img" :src="item.team_avatar_url" alt="">
            </div>
            <div class="id">TEAMID:{{item.team_id}}</div>
            <div class="name">{{item.team_name}}</div>
            <div class="user-content">
              <el-tag tyoe="info" size="mini" v-for="j in item.users" class="user" @click="jumpToUser(j)">{{j.username}}</el-tag>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="jumpToEdit()">编辑赛事</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompetitionTotal } from '@/api/competition'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchCompetitionList(1)
  },
  data() {
    return {
      dialogVisible:false,
      nowlist:[],
      outlist:[],
      list:[],
      selectItem:''
    }
  },
  methods:{
    opendialog(e) {
      this.selectItem = e
      this.dialogVisible = true
    },
    jumpToTeam(item) {
      let id = item.team_id
      this.$router.push({
        path:'/team/detail',
        query:{
          team_id:id
        }
      })
    },
    jumpToUser(j) {
      let id = j.user_id
      this.$router.push({
        path:'/user/detail',
        query:{
          user_id:id
        }
      })
    },
    jumpToEdit() {
      let id = this.selectItem.comp_id
      this.$router.push({
        path:'/competition/detail',
        query:{
          comp_id:id
        }
      })
      // this.$router.push({ path: '/competition/detail', query: { comp_id: row.comp_id }})
    },
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    fetchCompetitionList(page) {
      getCompetitionTotal(page).then(response => {
        let nowdate = new Date()
        this.list = response.data.list
        this.list.forEach((e,i)=>{
          let date = new Date(e.end_time)
          if (nowdate >= date) {
            this.outlist.push(e)
          } else {
            this.nowlist.push(e)
          }
        })
        console.log(this.list)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background: rgb(233,236,239);
  .dashboard-text {
    padding: 10px 0 0;
    margin: 0 20px;
    font-size: 24px;
    line-height: 42px;
  }
  
}
.list-container {
    // background: pink;
    width:100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .list-card{
      cursor: pointer;
      position: relative;
      border-radius: 6px;
      width:17%;
      margin: 20px 18px;
      background: #fff;
      box-sizing: border-box;
      height: 320px;
      .degree{
        border-radius: 3px;
        padding: 6px 8px;
        color: #fff;
        font-size: 14px;
        background:rgb(0,129,255 );
        position: absolute;
        top:-4px;
        right: -4px;
      }
      .img-container{
        width: 100%;
        height: 120px;
        overflow: hidden;
        .comp_img{
          height: 100%;
        }
      }
      .content{
        padding: 10px;
        height: 165px;
        overflow: hidden;
        .title{
          margin: 12px 0;
          font-weight: bold;
          font-size: 18px;
        }
        .desc{
          color: #6c757d;
          font-size: 14px;
        }
      }
      .tag-container{
        padding:7px 10px;
        display: flex;
        width: 100%;
        justify-content: flex-start;
        .tag{
          padding: 4px 6px;
          border-radius: 6px;
          background: rgb(241,241,241);
          margin: 0px 4px;
          font-size: 12px;
        }
      }
    }
  }
  .dialog-content{
    .title{
      font-weight: bold;
      font-size: 20px;
    }
    .team-container{
      margin: 10px 0;
      display: flex;
      justify-content: flex-start;
      .team{
        
        margin: 10px;
        width: 100px;
        height: 150px;
        .avatar-container{
          cursor: pointer;
          margin: 5px auto;
          width: 50px;
          height: 50px;
          .avatar-img{
            width: 100%;
          }
        }
        .id{
          text-align: center;
          font-size: 12px;
          color:rgb(80,80,80);
        }
        .name{
          cursor: pointer;
          margin: 5px 0;
          font-weight: bold;
          text-align: center;
        }
        .user-content{
          margin: 5px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          .user{
            cursor: pointer;
            display: i;
            margin: 2px 0;
            // border: 1px solid rgb(80,80,80);
          }
        }
      }
    }
  }
</style>
