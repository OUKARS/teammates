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
          {{ scope.row.comp_id }}
        </template>
      </el-table-column>
      <el-table-column label="赛事名" :show-overflow-tooltip="true" min-width="11%">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="赛事图"
        min-width="8%"
      >
        <template slot-scope="scope">
          <img class="competition-img" :src="scope.row.img_url">
          <!-- <span style="margin-left: 10px">{{ scope.row.headimgurl }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="主办方" align="center" :show-overflow-tooltip="true" min-width="5%">
        <template slot-scope="scope">
          <span>{{ scope.row.sponsor }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="赛事标签"
        min-width="5%"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <el-tag v-for="item in scope.row.tags" :key="item.tag_id" style="margin:2px 4px;!important" size="medium">{{ scope.row.tags[0].tag_name }}</el-tag>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.tags[0].tag_name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="赛事简介" align="center" :show-overflow-tooltip="true" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="start_time"
        label="赛事开始时间"
        :formatter="dateForMat"
        min-width="7%"
      />
      <el-table-column
        align="center"
        prop="end_time"
        label="赛事结束时间"
        :formatter="dateForMat"
        min-width="7%"
      />
      <el-table-column
        align="center"
        label="数据"
        min-width="4%"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>浏览次数: {{ scope.row.view_count }}</p>
            <p>收藏人数: {{ scope.row.love_count }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.view_count }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="add_time"
        label="添加时间"
        min-width="10%"
      />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            style="margin:2px 4px;"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            style="margin:2px 4px;"
            size="mini"
            type="danger"
            @click="deleteCompetition(scope.row)" >删除</el-button>
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
import { getCompetitionList, deleteCompetition } from '@/api/competition'

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
      this.fetchCompetitionList(newVal)
    }
  },
  created() {
    this.fetchCompetitionList(1)
  },
  methods: {
    fetchCompetitionList(page) {
      this.listLoading = true
      getCompetitionList(page).then(response => {
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
    deleteCompetition(row) {
      let that = this
      this.$confirm(`确定要删除赛事【${row.title}】吗？`, '删除赛事', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompetition(row.comp_id).then(res => {
          that.fetchCompetitionList(that.currentPage)
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
