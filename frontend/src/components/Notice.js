const Notice = (props) => {
    const noticeStyle = {
        color: 'green',
        font: 20,
        backGroundColor: '#E7E1E0',
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    if (!props.message) {
        return null
    }
    return (
        <div style={noticeStyle}>
            {props.message}
        </div>
    )
}


export default Notice