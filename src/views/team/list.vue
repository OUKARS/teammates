<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="3%">
        <template slot-scope="scope">
          {{ scope.row.team_id }}
        </template>
      </el-table-column>
      <el-table-column label="队伍名" :show-overflow-tooltip="true" min-width="11%">
        <template slot-scope="scope">
          {{ scope.row.team_name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="队伍头像"
        min-width="8%"
      >
        <template slot-scope="scope">
          <img class="competition-img" :src="scope.row.team_avatar_url">
          <!-- <span style="margin-left: 10px">{{ scope.row.headimgurl }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="是否公开" align="center" :show-overflow-tooltip="true" min-width="5%">
        <template slot-scope="scope">
          <span>{{ scope.row.team_isOpen }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="参赛赛事"
        min-width="5%"
      >
        <template slot-scope="scope" >
          <el-popover  v-if="scope.row.competitions.length>0" trigger="hover" placement="top">
            <el-tag v-for="item in scope.row.competitions" :key="item.comp_id" style="margin:2px 4px;!important" size="medium">{{ item.title }}</el-tag>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.competitions[0].title }}</el-tag>
            </div>
          </el-popover>
          <el-popover  v-else trigger="hover" placement="top">
            <div slot="reference" class="name-wrapper">
              无
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="参赛成员"
        min-width="5%"
      >
        <template slot-scope="scope" >
          <el-popover  v-if="scope.row.users.length>0" trigger="hover" placement="top">
            <!-- <el-tag v-for="item in scope.row.users" :key="item.user_id" style="margin:2px 4px;!important" size="medium">{{ item.username }}</el-tag> -->
            <div  v-for="(item,index) in scope.row.users" :key="item.user_id" slot="reference" class="name-wrapper" >
              <el-tag  :class="{'leader':item.team_user.position == 1}" size="medium">{{ item.username }}</el-tag>
            </div>
          </el-popover>
          <el-popover  v-else trigger="hover" placement="top">
            <div slot="reference" class="name-wrapper">
              无
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="队伍简介" align="center" :show-overflow-tooltip="true" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.team_intro }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="add_time"
        label="创建时间"
        min-width="10%"
      />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            style="margin:2px 4px;"
            size="mini"
            type="primary"
            @click="editTeam(scope.row)">编辑</el-button>
          <el-button
            style="margin:2px 4px;"
            size="mini"
            type="danger"
            @click="deleteTeam(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="list-pagination"
      background
      layout="prev, pager, next"
      :page-count="pageNum"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getTeamList, deleteTeam } from '@/api/team'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      currentPage: 1,
      pageNum: 0,
      page: 1 // 默认当前页数为1
    }
  },
  watch: {
    'currentPage': function(newVal) {
      this.fetchTeamList(newVal)
    }
  },
  created() {
    this.fetchTeamList(1)
  },
  methods: {
    fetchTeamList(page) {
      this.listLoading = true
      getTeamList(page).then(response => {
        this.list = response.data.list
        this.pageNum = response.data.pageNum
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      // 修改分页当前页
      this.currentPage = val
    },
    dateForMat(row, column) {
      const date = row[column.property]
      return this.$moment(date).format('YYYY-MM-DD')
    },
    editTeam(row) {
      this.$router.push({ path: '/team/detail', query: { team_id: row.team_id }})
    },
    deleteTeam(row) {
      let that = this
      this.$confirm(`确定要删除队伍【${row.team_name}】吗？`, '删除赛事', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTeam(row.team_id).then(res => {
          that.fetchTeamList(that.currentPage)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.competition-img{
  width: 5rem;
  height: 3rem;
}
.leader{
  margin: 4px 0;
  background-color: orange !important;
  border-color: orange !important;
  color:#fff
}
</style>
