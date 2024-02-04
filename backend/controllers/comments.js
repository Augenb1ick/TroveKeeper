const Comment = require('../models/comment');

function commentsSocketsController(io) {
    io.on('connection', (socket) => {
        socket.on('joinItemRoom', (itemId) => {
            socket.join(itemId);

            Comment.find({ itemId })
                .then((comments) => {
                    socket.emit('allComments', comments);
                })
                .catch((error) => {
                    console.error('Error sending all comments:', error);
                });
        });

        socket.on('deleteComment', async ({ itemId, commentId }) => {
            try {
                await Comment.findByIdAndDelete(commentId);

                io.to(itemId).emit('deleteComment', commentId);
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        });

        socket.on('addComment', async (data) => {
            try {
                const { itemId, owner, ownerName, text } = data;

                Comment.create({ itemId, owner, ownerName, text }).then(
                    (newComment) => {
                        io.to(itemId).emit('newComment', newComment);
                    }
                );
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });
    });
}

module.exports = commentsSocketsController;
