import lessVars from '@css/var.scss'

export default {
    0: {
        text: '待办',
        type: 'info',
        icon: 'el-icon-remove',
        color: lessVars.infoColor,
    },
    1: {
        text: '未开始',
        type: 'warning',
        icon: 'el-icon-question',
        color: lessVars.warningColor,
    },
    2: {
        text: '进行中',
        type: 'primary',
        icon: 'el-icon-info',
        color: lessVars.primaryColor,
    },
    3: {
        text: '已完成',
        type: 'success',
        icon: 'el-icon-success',
        color: lessVars.successColor,
    },
    4: {
        text: '已归档',
        type: 'success',
        icon: 'el-icon-document',
        show: false,
        color: lessVars.successColor,
    },
}