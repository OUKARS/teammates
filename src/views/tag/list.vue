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
      <el-table-column align="center" label="赛事ID">
        <template slot-scope="scope">
          {{ scope.row.tag_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签名" :show-overflow-tooltip="true" min-width="300px">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.tag_name" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.tag_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="mini"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确认
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-edit"
            @click="deleteTag(row)"
          >
            删除
          </el-button>
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
import { getTagList, editTag, deleteTag} from '@/api/tag'

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
      this.fetchTagList(newVal)
    }
  },
  created() {
    this.fetchTagList(1)
  },
  methods: {
    fetchTagList(page) {
      this.listLoading = true
      getTagList(page).then(response => {
        this.list = response.data.list
        this.pageNum = response.data.pageNum
        this.list = this.list.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalName = v.tag_name //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      })
    },
    cancelEdit(row) {
      row.tag_name = row.originalName
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      if (row.originalName !== row.tag_name) {
        editTag(row.tag_id,row.tag_name)
      }
      row.originalName = row.tag_name
    },
    deleteTag(row) {
      let that = this
      this.$confirm(`确定要删除标签【${row.tag_name}】吗？`, '删除标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTag(row.tag_id).then(res => {
          that.fetchTagList(that.currentPage)
        })
      })
    },
    handleCurrentChange(val) {
      // 修改分页当前页
      this.currentPage = val
    }
  }
}
</script>
<style lang="scss" scoped>
.competition-img{
  width: 5rem;
  height: 3rem;
}
.list-pagination{
  margin:1rem;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
