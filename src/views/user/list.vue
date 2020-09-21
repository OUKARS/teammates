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
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column label="用户账户" :show-overflow-tooltip="true" min-width="11%">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" :show-overflow-tooltip="true" min-width="11%">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户头像"
        min-width="8%"
      >
        <template slot-scope="scope">
          <img class="competition-img" :src="scope.row.avatar_url">
          <!-- <span style="margin-left: 10px">{{ scope.row.headimgurl }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" :show-overflow-tooltip="true" min-width="5%">
        <template slot-scope="scope">
          <span>{{ scope.row.gender == 0?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column
       
        align="center"
        label="参与队伍"
        min-width="5%"
      >
        <template slot-scope="scope" >
          <el-popover v-if="scope.row.teams.length>0" trigger="hover" placement="top">
            <el-tag v-for="item in scope.row.teams" :key="item.team_id" style="margin:2px 4px;!important" size="medium">{{ item.team_name }}</el-tag>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.teams[0].team_name }}</el-tag>
            </div>
          </el-popover>
          <el-popover v-else trigger="hover" placement="top">
            <div slot="reference" class="name-wrapper">
              无
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="用户介绍" align="center" :show-overflow-tooltip="true" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.user_intro }}
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
            @click="editUser(scope.row)">编辑</el-button>
          <el-button
            style="margin:2px 4px;"
            size="mini"
            type="danger"
            @click="deleteUser(scope.row)" >删除</el-button>
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
import { getUserList, deleteUser } from '@/api/user'

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
      this.fetchUserList(newVal)
    }
  },
  created() {
    this.fetchUserList(1)
  },
  methods: {
    fetchUserList(page) {
      this.listLoading = true
      getUserList(page).then(response => {
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
    editUser(row) {
      this.$router.push({ path: '/user/detail', query: { user_id: row.user_id }})
    },
    deleteUser(row) {
      let that = this
      this.$confirm(`确定要删除用户【${row.username}】吗？`, '删除赛事', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.user_id).then(res => {
          that.fetchUserList(that.currentPage)
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
</style>
