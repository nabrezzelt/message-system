//Load all Conversations include TabContainer
AJAXCode = 
{
    OK : 0,
    FAILED : 1
}

window.setInterval(function(){
    var myID = $(".user-data").data('id');

    //Do Sutuff for current open tab
    var currentConversationID = $("li.active a[data-toggle='tab']").data("conversation-id"); 
    createTime = $("#conversation-" + currentConversationID + " .chat-container .other-message:last .message-data-other").text();

    $.get("ajax.php?act=get-messages-after&conversation-id=" + currentConversationID + "&after=" + createTime, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) 
        {
            var message = data[i];
            console.log(message);   //Object { id: "91", message: "peter", user: Object, createTime: "2017-02-10 10:08:10" }

            //$("#conversation-" + currentConversationID + " .chat-container").append("<div class='other-message'>" + message.message + "<div class='message-data-other text-right text-muted'><span class='glyphicon glyphicon-time'></span> 2017-02-10 10:05:26</div></div>") 
        }
        messages = formatMessages(data, myID);
        console.log(messages);
        $("#conversation-" + currentConversationID + " .chat-container").append(messages);

        if(messages != "")
        {
            $("#conversation-" + currentConversationID + " .chat-container").animate({
                scrollTop: $("#conversation-" + currentConversationID + " .chat-container")[0].scrollHeight },
                1000
            ); 
        }   
                                      
    }, 'json');
    
 

    //Do stuff for all other Tabs where not active
    

    console.log("Check for new Messages");
}, 3000);

function checkForNewMessages(conversationID)
{

}

//Function do stuff on click on tab
$(document).on('click', "a[data-toggle='tab']", function() {
    console.log("tab changed");
    var conversationID = $(this).data('conversation-id');
    
});

$(document).on('keydown', 'textarea[data-conversation-id]', function (e){
    if(e.keyCode == 13) {
        var conversationID = $(this).data("conversation-id");

        $("button[data-conversation-id='" + conversationID + "']").trigger('click');
    }
});

$(document).ready(function() {
    var myID = $(".user-data").data('id');        

    $.get("ajax.php?act=all-conversations", function (data) {        
        for (var i = 0; i < data.length; i++) {
            var conversation = data[i];
            console.log(conversation);
           
            $('.nav-tabs').append("<li " + ((i == 0) ? "class='active'": '') + "><a data-toggle='tab' data-conversation-id='" + conversation.id + "' href='#conversation-" + conversation.id + "'>" + ((conversation.userA.id == myID) ? conversation.userB.username : conversation.userA.username) + "</a></li>");
                              

            if(i == 0)
            {                
                $('.tab-content').html("<div id='conversation-" + conversation.id + "' class='tab-pane fade in active'>" +
                                            "<div class='chat-container col-sm-10'>" +
                                                formatMessages(conversation.messages, myID) + 
                                            "</div>" +
                                            "<div class='textbox-container'>" +
                                                "<div class='form-group col-sm-10'>" +
                                                    "<div class='row'>" +                                                            
                                                        "<div><textarea data-conversation-id='" + conversation.id + "' class='form-control message-textbox col-sm-8' rows='3' placeholder='Your Message'></textarea></div>" +
                                                    "</div>" +
                                                "</div>" +
                                                "<div class='col-sm-10 text-right'>" +
                                                "<button data-conversation-id='" + conversation.id + "' class='btn-send btn btn-primary disabled' type='submit'>Send</button>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>");
            }
            else
            {
                $('.tab-content').append("<div id='conversation-" + conversation.id + "' class='tab-pane fade in'>" +
                                            "<div class='chat-container col-sm-10'>" +
                                                formatMessages(conversation.messages, myID) + 
                                            "</div>" +
                                            "<div class='textbox-container'>" +                                                
                                                "<div class='form-group col-sm-10'>" +
                                                    "<div class='row'>" +                                                           
                                                        "<div><textarea data-conversation-id='" + conversation.id + "' class='form-control message-textbox col-sm-8' rows='3' placeholder='Your Message'></textarea></div>" +
                                                    "</div>" +
                                                "</div>" +
                                                "<div class='col-sm-10 text-right'>" +
                                                "<button data-conversation-id='" + conversation.id + "' class='btn-send btn btn-primary disabled' type='submit'>Send</button>" +
                                                "</div>" +                                               
                                            "</div>" +
                                        "</div>");                
            }
        }
    }, 'json');    
});

$(document).on('click', '.btn-send', function() {
    if($(this).hasClass('disabled'))
    {
        console.log("no Text to Send");        
        return;
    }

    var conversationID = $(this).data('conversation-id');
    var msg = $("textarea[data-conversation-id='" + conversationID + "']").val();
    console.log(msg);

    $.ajax({
        type: "POST",
        url: "ajax.php?act=send-message&conversation-id=" + conversationID,
        data: {content: msg},
        success: function(data) {
            if(data.AJAXCode == AJAXCode.OK)
            {
                console.log(data);

                $("#conversation-" + conversationID + " .chat-container").append("<div class='my-message'>" + msg + "<div class='message-data text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + getCurrentDate() + "</div></div>");

                $("textarea[data-conversation-id='" + conversationID + "']").val("");
                $("button[data-conversation-id='" + conversationID + "']").addClass('disabled');

                $("#conversation-" + conversationID + " .chat-container").animate({
                    scrollTop: $("#conversation-" + conversationID + " .chat-container")[0].scrollHeight},
                    1000
                );                
            }
        },
        dataType: 'json'
    });
});


$(document).on('input', '[data-conversation-id]', function() {
    var conversationID = $(this).data('conversation-id');

    if($(this).val() != "")
    {
        $("*[data-conversation-id='" + conversationID + "']").removeClass('disabled');
    }
    else
    {
        $("*[data-conversation-id='" + conversationID + "']").addClass('disabled');
    }
});

function formatMessages(messageData, myID)
{    
    var messages = "";
    for (var j = 0; j < messageData.length; j++) 
    {
        var message = messageData[j]; 
        console.log(message.content);
        
        if(message.user.id == myID)
        {
            messages += ("<div class='my-message'>" + message.content + "<div class='message-data text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + message.createTime + "</div></div>");                          
        } 
        else
        {
            messages += ("<div class='other-message'>" + message.content + "<div class='message-data-other text-right text-muted'><span class='glyphicon glyphicon-time'></span> " + message.createTime + "</div></div>"); 
        }                                                                
    }        
    return messages;
}


function getCurrentDate()
{
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();
    return curr_year + "-" + ((curr_month < 10) ? '0' : '') + curr_month + "-" + ((curr_date < 10) ? '0' : '') + curr_date + " " + ((curr_hour < 10) ? '0' : '') + curr_hour + ":" + curr_min + ":" + ((curr_sec < 10) ? '0' : '') + curr_sec;
}