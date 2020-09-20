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
      <el-table-column align="center" label="赛事ID" min-width="4%">
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
        min-width="8%"
      />
      <el-table-column
        align="center"
        prop="end_time"
        label="赛事结束时间"
        :formatter="dateForMat"
        min-width="8%"
      />
      <el-table-column
        align="center"
        prop="view_count"
        label="赛事浏览人数"
        min-width="5%"
      />
      <el-table-column
        align="center"
        prop="love_count"
        label="赛事收藏人数"
        min-width="5%"
      />
      <el-table-column
        align="center"
        prop="add_time"
        label="添加时间"
        min-width="10%"
      />
    </el-table>
  </div>
</template>

<script>
import { getCompetitionList } from '@/api/competition'

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
      listLoading: true
    }
  },
  created() {
    this.fetchCompetitionList()
  },
  methods: {
    fetchCompetitionList() {
      this.listLoading = true
      getCompetitionList(1).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    dateForMat(row, column) {
      const date = row[column.property]
      return this.$moment(date).format('YYYY-MM-DD')
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
