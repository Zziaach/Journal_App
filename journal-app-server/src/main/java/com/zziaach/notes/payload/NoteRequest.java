package com.zziaach.notes.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class NoteRequest {

    @NotBlank
    @Size(max = 250)
    private String title;

    @NotBlank
    private String content;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}