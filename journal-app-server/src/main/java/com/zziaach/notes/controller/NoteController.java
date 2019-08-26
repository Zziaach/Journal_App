package com.zziaach.notes.controller;

import com.zziaach.notes.repository.NoteRepository;
import com.zziaach.notes.repository.UserRepository;
import com.zziaach.notes.security.CurrentUser;
import com.zziaach.notes.security.UserPrincipal;
import com.zziaach.notes.service.NoteService;
import com.zziaach.notes.util.AppConstants;

import java.net.URI;

import javax.validation.Valid;

import com.zziaach.notes.model.Note;
import com.zziaach.notes.payload.ApiResponse;
import com.zziaach.notes.payload.NoteRequest;
import com.zziaach.notes.payload.NoteResponse;
import com.zziaach.notes.payload.PagedResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteService noteService;

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    @GetMapping
    public PagedResponse<NoteResponse> getNotes(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return noteService.getAllNotes(page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createNote(@Valid @RequestBody NoteRequest noteRequest) {
        Note note = noteService.createNote(noteRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{noteId}").buildAndExpand(note.getId())
                .toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Note Created Successfully"));
    }

    @GetMapping("/{noteId}")
    public NoteResponse getNoteById(@PathVariable Long noteId) {
        return noteService.getNoteById(noteId);
    }
}