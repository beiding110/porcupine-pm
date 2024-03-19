<template>
    <div class="upload-e">
        <el-upload
            action="/pm/file/upload"
            :listType="listType"
            :file-list="model"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            v-bind="$attrs"
        >
            <el-button
                v-if="['text', 'picture'].includes(listType)"
                size="small"
                type="primary"
                icon="el-icon-upload"
            >
                点击上传
            </el-button>

            <i
                v-if="['picture-card'].includes(listType)"
                class="el-icon-plus"
            ></i>
        </el-upload>

        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
        >
            <img
                width="100%"
                :src="dialogImageUrl"
                alt=""
            />
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        listType: {
            type: String,
            default: 'text',
        },
        limit: {
            type: Number,
            default: 0,
        },
        single: {
            type: Boolean,
            default: false,
        },
        size: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
        };
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        isSingle() {
            return this.limit === 1 || this.single;
        },
    },
    methods: {
        beforeAvatarUpload(file) {
            if (this.isSingle && this.model.length >= 1) {
                // 单文件

                return false;
            }

            if (this.limit && this.model.length >= this.limit) {
                // 文件数量

                return false;
            }

            const fileSize = file.size / 1024 / 1024;

            if (this.size && fileSize > this.size) {
                // 文件大小

                return false;
            }

            return true;
        },
        handleSuccess(res, file, fileList) {
            this.model = [...this.model, res.tdata];
        },
        handleRemove(file, fileList) {
            this.model = fileList;
        },
        handlePreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>