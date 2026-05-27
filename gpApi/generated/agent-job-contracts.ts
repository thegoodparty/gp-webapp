export type ComplianceSetupOutput = {
  [k: string]: unknown
}
/**
 * v2 artifact schema for the meeting_briefing experiment. Drop into manifest.json's output_schema field at port time.
 */
export type MeetingBriefingOutput =
  | MeetingBriefingFull
  | MeetingBriefingPlaceholder
export type MeetingSchedule = MeetingScheduleFound | MeetingScheduleNotFound

export interface AgentJobContracts {
  compliance_setup: {
    Input: {
      /**
       * Numeric Campaign.id in gp-api. Foreign key the agent passes back to gp-api MCP tools for every state read/write.
       */
      campaign_id: number
      /**
       * Candidate first name. Used for the `{first_initial}` placeholder in the domain pattern catalog. Empty string skips the two patterns that depend on first_initial (per instruction.md: 'When unset or empty string, skip the two patterns that need it').
       */
      candidate_first_name: string
      /**
       * Candidate last name. Used for `{last_name}` and `{last_initial}` placeholders in the domain pattern catalog.
       */
      candidate_last_name: string
      /**
       * Clerk user id of the candidate. Broker mints actor-token sessions against this id when proxying MCP calls to gp-api.
       */
      clerk_user_id: string
      /**
       * Per-candidate domain budget. Agent searches at min($10, this) first; if no match and this > 10, retries once at this cap. Above this is a hard `budget_exceeded` blocker.
       */
      domain_budget_cap_usd?: number
      /**
       * YYYY-MM-DD. Drives the {mm}/{month_abbreviation}/{yyyy} placeholders in the domain pattern catalog (instruction.md).
       */
      election_date: string
      /**
       * Optional hint from the recovery loop indicating the last persisted stage. The agent treats it as a skip-list signal only — the durable compliance state read in Step 1 remains the truth.
       */
      resume_from_stage?:
        | 'pending_dispatch'
        | 'domain_search_started'
        | 'domain_purchased'
        | 'website_content_published'
        | 'pending_website_live'
        | 'website_verified_live'
        | 'tcr_submitted'
        | 'failed'
      /**
       * Fallback run identifier used only when the RUN_ID env var is absent. When RUN_ID is set, the agent must use RUN_ID and ignore this field. The platform's recovery loop correlates runs by the env-var value, so the artifact must never record this field's value if it differs from RUN_ID.
       */
      run_id?: string
      /**
       * Why this run was dispatched. `initial` = first dispatch after Pro purchase. `recovery_resume` = re-dispatch by the recovery loop (ENG-7554) after a wait condition cleared; the agent reads `resume_from_stage` as a skip-list hint but still trusts gp-api durable state as the source of truth.
       */
      trigger: 'initial' | 'recovery_resume'
    }
    Output: ComplianceSetupOutput
  }
  district_issue_pulse: {
    Input: {
      /**
       * Full city name (e.g. Fayetteville).
       */
      city: string
      /**
       * L2 district value to match (e.g. FAYETTEVILLE CITY WARD 2).
       */
      l2DistrictName: string
      /**
       * L2 voter file column name for district (e.g. City_Ward).
       */
      l2DistrictType: string
      /**
       * 2-letter state code (e.g. NC).
       */
      state: string
    }
    Output: DistrictIssuePulse
  }
  district_issue_snapshot: {
    Input: DistrictIssueSnapshotInput
    Output: DistrictIssueSnapshotOutput
  }
  meeting_briefing: {
    Input: {
      /**
       * L2 district value to match (e.g. "25"). Required if l2DistrictType is set.
       */
      l2DistrictName?: string
      /**
       * L2 voter file column for the official's district (e.g. City_Council_Commissioner_District). ASCII identifier shape — interpolated as a backtick-quoted column name in Databricks SQL. Omit for at-large officials.
       */
      l2DistrictType?: string
      /**
       * Full name of the elected official (e.g. "Shekar Krishnan").
       */
      officialName: string
      /**
       * The EO's position.
       */
      positionName?: string
      /**
       * 2-letter state code (e.g. NY).
       */
      state: string
    }
    Output: MeetingBriefingOutput
  }
  meeting_schedule: {
    Input: MeetingScheduleInput
    Output: MeetingSchedule
  }
}
export interface DistrictIssuePulse {
  city: string
  generated_at: string
  l2_district_name: string
  l2_district_type: string
  state: string
  /**
   * @minItems 5
   * @maxItems 5
   */
  top_issues: [
    {
      hs_column: string
      issue_label: string
      news: {
        published_date?: string
        source_name: string
        summary: string
        url: string
      }
      rank: number
      voter_count: number
      voter_percentage: number
    },
    {
      hs_column: string
      issue_label: string
      news: {
        published_date?: string
        source_name: string
        summary: string
        url: string
      }
      rank: number
      voter_count: number
      voter_percentage: number
    },
    {
      hs_column: string
      issue_label: string
      news: {
        published_date?: string
        source_name: string
        summary: string
        url: string
      }
      rank: number
      voter_count: number
      voter_percentage: number
    },
    {
      hs_column: string
      issue_label: string
      news: {
        published_date?: string
        source_name: string
        summary: string
        url: string
      }
      rank: number
      voter_count: number
      voter_percentage: number
    },
    {
      hs_column: string
      issue_label: string
      news: {
        published_date?: string
        source_name: string
        summary: string
        url: string
      }
      rank: number
      voter_count: number
      voter_percentage: number
    },
  ]
  total_active_voters: number
}
export interface DistrictIssueSnapshotInput {
  /**
   * Full city name (e.g. Fayetteville).
   */
  city: string
  /**
   * Short issue phrase to match against hs_* columns (e.g. 'affordable housing', 'minimum wage').
   */
  issueKeyword: string
  /**
   * L2 district value to match (e.g. FAYETTEVILLE CITY WARD 2).
   */
  l2DistrictName: string
  /**
   * L2 voter file column name for district (e.g. City_Ward).
   */
  l2DistrictType: string
  /**
   * 2-letter state code (e.g. NC).
   */
  state: string
}
export interface DistrictIssueSnapshotOutput {
  aligned_voter_count: number | null
  aligned_voter_percentage: number | null
  city: string
  generated_at: string
  issue_keyword: string
  issue_label: string
  l2_district_name: string
  l2_district_type: string
  matched_hs_column: string | null
  news: {
    published_date: string
    source_name: string
    summary: string
    title: string
    url: string
  }
  state: string
  total_active_voters: number
}
export interface MeetingBriefingFull {
  /**
   * Full briefing produced. UI renders normal briefing.
   */
  briefing_status: 'briefing_ready' | 'agenda_provided_by_user'
  /**
   * Self-identification of the briefing kind.
   */
  briefing_type:
    | 'city_council_meeting'
    | 'county_legislature_meeting'
    | 'school_board_meeting'
  /**
   * May be empty when briefing_status is awaiting_agenda or no_meeting_found. Capped at 200 to bound the validator's O(claims × sources × extracts) substring scan.
   *
   * @maxItems 200
   */
  claims: {
    claim_id: string
    claim_text: string
    claim_type:
      | 'budget_number'
      | 'vote_count'
      | 'legal_citation'
      | 'staff_recommendation'
      | 'constituent_sentiment'
      | 'news_context'
      | 'historical_context'
      | 'inferred'
    claim_weight: 'high' | 'medium' | 'low'
    item_id: string
    required_source_type:
      | 'agenda_packet'
      | 'government_website'
      | 'news'
      | 'haystaq'
      | 'none'
    route_if_unsupported: 'block_release' | 'omit_claim' | 'flag_as_inferred'
    section:
      | 'overview'
      | 'constituent_sentiment'
      | 'recent_news'
      | 'budget_impact'
      | 'talking_points'
    /**
     * @minItems 1
     * @maxItems 10
     */
    source_extracts:
      | [string]
      | [string, string]
      | [string, string, string]
      | [string, string, string, string]
      | [string, string, string, string, string]
      | [string, string, string, string, string, string]
      | [string, string, string, string, string, string, string]
      | [string, string, string, string, string, string, string, string]
      | [string, string, string, string, string, string, string, string, string]
      | [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
    /**
     * @minItems 1
     */
    source_ids: [string, ...string[]]
  }[]
  /**
   * Required verbatim disclaimer per required_disclosure.md.
   */
  disclosure: string
  estimated_read_minutes: number
  executive_summary: {
    /**
     * One entry per featured item in top-level items[], in the same order. Empty when no items qualify as featured (and for placeholder briefing_status values).
     *
     * @maxItems 5
     */
    items:
      | []
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
    /**
     * Single framing sentence at the top of the briefing. For briefing_ready artifacts: defaults to 'The following items on your agenda require action and/or have a vote:' (with trailing colon when items follow). For awaiting_agenda / no_meeting_found / error: a check-back or no-meeting message; items[] is empty.
     */
    lead_in: string
  }
  /**
   * Experiment id, echoed from PARAMS.
   */
  experiment_id: string
  /**
   * ISO 8601 UTC timestamp when the briefing was generated.
   */
  generated_at: string
  /**
   * @minItems 1
   */
  items: [
    {
      display: {
        budget_impact?: null | {
          /**
           * @minItems 1
           */
          figures: [
            {
              label: string
              source_id: string
              value: string
            },
            ...{
              label: string
              source_id: string
              value: string
            }[],
          ]
          /**
           * References to ids in the top-level sources[] list that back this section as a whole. Complements per-figure figures[].source_id (which cites the specific document a number was extracted from); this section-level list cites the section overall and renders as inline source pills in the UI. Required-but-may-be-empty: emit [] when the section's narrative draws solely from figures whose source_id already covers it.
           */
          source_ids: string[]
          summary: string
        }
        constituent_sentiment?: null | {
          detail?: string | null
          district_note?: string | null
          haystaq_column: string
          haystaq_status: 'ok' | 'no_match' | 'city_mismatch' | 'no_column'
          mean_score: number
          /**
           * Short string describing what high values represent. Derived from the catalog entry's `meaning` field (e.g. "supports gun control").
           */
          score_direction: string
          /**
           * References to ids in the top-level sources[] list that back this section as a whole. Required-but-may-be-empty: emit [] when no specific source cites the section (rare for haystaq sentiment, which should reference the Haystaq source entry). Authors must not fabricate citations to pad this list.
           */
          source_ids: string[]
          summary: string
          voter_count: number
        }
        recent_news?:
          | null
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
        summary: string
        talking_points?:
          | null
          | [string, string, string]
          | [string, string, string, string]
          | [string, string, string, string, string]
      }
      id: string
      /**
       * Agenda item number as a string (e.g. '5F'). Set to null only for the single placeholder item emitted when briefing_status is awaiting_agenda or no_meeting_found.
       */
      item_number: string | null
      research: {
        full_treatment: null | {
          budget_detail: null | {
            /**
             * @minItems 1
             */
            figures: [
              {
                label: string
                value: string
                verbatim_extract: string
              },
              ...{
                label: string
                value: string
                verbatim_extract: string
              }[],
            ]
          }
          haystaq_detail: null | {
            city_mean_score?: number | null
            city_voter_count?: number | null
            complementary_field?: string | null
            district_mean_score?: number | null
            district_voter_count?: number | null
            haystaq_column: string | null
            haystaq_status: 'ok' | 'no_match' | 'city_mismatch' | 'no_column'
            query_executed?: string | null
          }
          news_articles:
            | null
            | {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                body_text: string
                headline: string
                publication: string
                publication_date?: string | null
                url: string
              }[]
        }
        /**
         * @minItems 1
         */
        raw_context: [
          {
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          },
          ...{
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          }[],
        ]
      }
      tier: 'featured' | 'queued' | 'standard'
      /**
       * Free-form short snake_case reasons explaining the tier assignment. Preferred values for the common cases: 'vote_required', 'public_position_required', 'budget_threshold', 'constituent_alignment', 'procedural', 'ceremonial', 'consent_routine', 'first_reading_only', 'received_and_filed_or_callup', 'land_use_referral', 'out_of_district', 'symbolic_resolution', 'placeholder'. Agent may use a domain-specific reason when none of the preferred values fit, but reuse preferred values when they apply (do not invent 'procedural_minutes' when 'procedural' already covers it).
       *
       * @minItems 1
       */
      tier_reason: [string, ...string[]]
      title: string
      vote_required: boolean
    },
    ...{
      display: {
        budget_impact?: null | {
          /**
           * @minItems 1
           */
          figures: [
            {
              label: string
              source_id: string
              value: string
            },
            ...{
              label: string
              source_id: string
              value: string
            }[],
          ]
          /**
           * References to ids in the top-level sources[] list that back this section as a whole. Complements per-figure figures[].source_id (which cites the specific document a number was extracted from); this section-level list cites the section overall and renders as inline source pills in the UI. Required-but-may-be-empty: emit [] when the section's narrative draws solely from figures whose source_id already covers it.
           */
          source_ids: string[]
          summary: string
        }
        constituent_sentiment?: null | {
          detail?: string | null
          district_note?: string | null
          haystaq_column: string
          haystaq_status: 'ok' | 'no_match' | 'city_mismatch' | 'no_column'
          mean_score: number
          /**
           * Short string describing what high values represent. Derived from the catalog entry's `meaning` field (e.g. "supports gun control").
           */
          score_direction: string
          /**
           * References to ids in the top-level sources[] list that back this section as a whole. Required-but-may-be-empty: emit [] when no specific source cites the section (rare for haystaq sentiment, which should reference the Haystaq source entry). Authors must not fabricate citations to pad this list.
           */
          source_ids: string[]
          summary: string
          voter_count: number
        }
        recent_news?:
          | null
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
          | [
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
              {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                headline: string
                publication: string
                publication_date?: string | null
                /**
                 * Optional cross-reference to a sources[] entry id; populate when the article also appears in sources[].
                 */
                source_id?: string | null
                url: string
              },
            ]
        summary: string
        talking_points?:
          | null
          | [string, string, string]
          | [string, string, string, string]
          | [string, string, string, string, string]
      }
      id: string
      /**
       * Agenda item number as a string (e.g. '5F'). Set to null only for the single placeholder item emitted when briefing_status is awaiting_agenda or no_meeting_found.
       */
      item_number: string | null
      research: {
        full_treatment: null | {
          budget_detail: null | {
            /**
             * @minItems 1
             */
            figures: [
              {
                label: string
                value: string
                verbatim_extract: string
              },
              ...{
                label: string
                value: string
                verbatim_extract: string
              }[],
            ]
          }
          haystaq_detail: null | {
            city_mean_score?: number | null
            city_voter_count?: number | null
            complementary_field?: string | null
            district_mean_score?: number | null
            district_voter_count?: number | null
            haystaq_column: string | null
            haystaq_status: 'ok' | 'no_match' | 'city_mismatch' | 'no_column'
            query_executed?: string | null
          }
          news_articles:
            | null
            | {
                article_type:
                  | 'reporting'
                  | 'opinion'
                  | 'editorial'
                  | 'press_release'
                  | 'government_communication'
                body_text: string
                headline: string
                publication: string
                publication_date?: string | null
                url: string
              }[]
        }
        /**
         * @minItems 1
         */
        raw_context: [
          {
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          },
          ...{
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          }[],
        ]
      }
      tier: 'featured' | 'queued' | 'standard'
      /**
       * Free-form short snake_case reasons explaining the tier assignment. Preferred values for the common cases: 'vote_required', 'public_position_required', 'budget_threshold', 'constituent_alignment', 'procedural', 'ceremonial', 'consent_routine', 'first_reading_only', 'received_and_filed_or_callup', 'land_use_referral', 'out_of_district', 'symbolic_resolution', 'placeholder'. Agent may use a domain-specific reason when none of the preferred values fit, but reuse preferred values when they apply (do not invent 'procedural_minutes' when 'procedural' already covers it).
       *
       * @minItems 1
       */
      tier_reason: [string, ...string[]]
      title: string
      vote_required: boolean
    }[],
  ]
  /**
   * Customary location for the meeting (e.g. 'City Hall Council Chambers, 200 Main St'). Required-but-may-be-empty: emit an empty string when no source for the run mentions a venue (e.g. a user-supplied agenda PDF that lacks a header). Otherwise prefer the room-level location and fall back to building + street address when only the building is given.
   */
  location: string
  /**
   * YYYY-MM-DD. For agenda_provided_by_user or awaiting_agenda runs, this is the target meeting date; for no_meeting_found it may be an estimated next date.
   */
  meeting_date: string
  /**
   * Official name of the meeting body as the source refers to it (e.g. 'City Council', 'Planning Board'). Used as the list-row title in the candidate dashboard. Mirrors meeting_schedule.meeting_name when a schedule exists.
   */
  meeting_name: string
  official_name: string
  required_data_points: {
    allowed_source_types?: (
      | 'agenda_packet'
      | 'news'
      | 'government_website'
      | 'campaign'
      | 'haystaq'
    )[]
    citation_required: boolean
    name: string
    required: boolean
    scope: 'all_items' | 'featured_queued' | 'featured'
    skip_reasons_allowed?: string[]
  }[]
  run_metadata: {
    /**
     * Permanent URL to the agenda packet. May be null when briefing_status is awaiting_agenda or no_meeting_found.
     */
    agenda_packet_url: string | null
    briefing_version?: string
    /**
     * Curated trail of agent judgment calls. Separate from conversation/log.txt; this is QA-facing.
     */
    run_decisions?: {
      decision: string
      reason: string
      timestamp: string
    }[]
    source_bundle_retrieved_at: string
  }
  sources: {
    article_date?: string | null
    article_type?:
      | 'reporting'
      | 'opinion'
      | 'editorial'
      | 'press_release'
      | 'government_communication'
      | null
    district_voters_n?: number | null
    haystaq_column?: string | null
    id: string
    name: string
    page_number?: number | null
    publisher?: string | null
    retrieved_at: string
    retrieved_text_or_snapshot: string
    score_value?: number | null
    section_heading?: string | null
    source_type:
      | 'agenda_packet'
      | 'news'
      | 'government_website'
      | 'campaign'
      | 'haystaq'
    specific_claim_found?: string | null
    url?: string | null
  }[]
}
export interface MeetingBriefingPlaceholder {
  /**
   * Early-exit / placeholder artifact. UI renders a check-back state. Use 'awaiting_agenda' when the meeting is on the calendar but the agenda packet has not been published. Use 'no_meeting_found' when no upcoming meeting exists within the 60-day search window. Use 'error' for unrecoverable run failures — populate run_metadata.run_decisions[] with the diagnostic trail.
   */
  briefing_status: 'awaiting_agenda' | 'no_meeting_found' | 'error'
  /**
   * Self-identification of the briefing kind.
   */
  briefing_type:
    | 'city_council_meeting'
    | 'county_legislature_meeting'
    | 'school_board_meeting'
  /**
   * Always empty for placeholder/early-exit artifacts.
   *
   * @maxItems 0
   */
  claims: []
  /**
   * Required verbatim disclaimer per required_disclosure.md.
   */
  disclosure: string
  estimated_read_minutes: number
  executive_summary: {
    /**
     * One entry per featured item in top-level items[], in the same order. Empty when no items qualify as featured (and for placeholder briefing_status values).
     *
     * @maxItems 5
     */
    items:
      | []
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
      | [
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
          {
            /**
             * Must resolve to an entry in top-level items[] with tier='featured'. UI uses this to link the entry to the corresponding deep-dive panel.
             */
            item_id: string
            /**
             * One-sentence distillation of items[item_id].display.summary (the Step 9 Overview) — same facts, tighter framing.
             */
            overview: string
            /**
             * Item title shown before the em-dash. Must verbatim equal items[item_id].title (denormalized for renderer convenience).
             */
            title: string
          },
        ]
    /**
     * Single framing sentence at the top of the briefing. For briefing_ready artifacts: defaults to 'The following items on your agenda require action and/or have a vote:' (with trailing colon when items follow). For awaiting_agenda / no_meeting_found / error: a check-back or no-meeting message; items[] is empty.
     */
    lead_in: string
  }
  /**
   * Experiment id, echoed from PARAMS.
   */
  experiment_id: string
  /**
   * ISO 8601 UTC timestamp when the briefing was generated.
   */
  generated_at: string
  /**
   * @minItems 1
   * @maxItems 1
   */
  items: [
    {
      display: {
        budget_impact?: null
        constituent_sentiment?: null
        recent_news?: null
        summary: string
        talking_points?: null
      }
      id: 'item_001'
      item_number: null
      research: {
        full_treatment: null
        /**
         * @minItems 1
         */
        raw_context: [
          {
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          },
          ...{
            chunk_id: string
            item_id: string
            item_title: string
            /**
             * @minItems 1
             */
            pages: [number, ...number[]]
            section_heading?: string | null
            source_id: string
            text: string
            tier: 'featured' | 'queued' | 'standard'
          }[],
        ]
      }
      tier: 'standard'
      /**
       * @minItems 1
       * @maxItems 1
       */
      tier_reason: ['placeholder']
      title: string
      vote_required: false
    },
  ]
  /**
   * Customary location for the meeting. Required-but-may-be-empty: populate when the meeting is identified (awaiting_agenda), emit an empty string when no_meeting_found or error.
   */
  location: string
  /**
   * YYYY-MM-DD. For agenda_provided_by_user or awaiting_agenda runs, this is the target meeting date; for no_meeting_found it may be an estimated next date.
   */
  meeting_date: string
  /**
   * Official name of the meeting body (e.g. 'City Council'). Required-but-may-be-empty: populate when the meeting is identified (awaiting_agenda), emit an empty string when no_meeting_found or error.
   */
  meeting_name: string
  official_name: string
  required_data_points: {
    allowed_source_types?: (
      | 'agenda_packet'
      | 'news'
      | 'government_website'
      | 'campaign'
      | 'haystaq'
    )[]
    citation_required: boolean
    name: string
    required: boolean
    scope: 'all_items' | 'featured_queued' | 'featured'
    skip_reasons_allowed?: string[]
  }[]
  run_metadata: {
    /**
     * Permanent URL to the agenda packet. May be null when briefing_status is awaiting_agenda or no_meeting_found.
     */
    agenda_packet_url: string | null
    briefing_version?: string
    /**
     * Curated trail of agent judgment calls. Separate from conversation/log.txt; this is QA-facing.
     */
    run_decisions?: {
      decision: string
      reason: string
      timestamp: string
    }[]
    source_bundle_retrieved_at: string
  }
  sources: {
    article_date?: string | null
    article_type?:
      | 'reporting'
      | 'opinion'
      | 'editorial'
      | 'press_release'
      | 'government_communication'
      | null
    district_voters_n?: number | null
    haystaq_column?: string | null
    id: string
    name: string
    page_number?: number | null
    publisher?: string | null
    retrieved_at: string
    retrieved_text_or_snapshot: string
    score_value?: number | null
    section_heading?: string | null
    source_type:
      | 'agenda_packet'
      | 'news'
      | 'government_website'
      | 'campaign'
      | 'haystaq'
    specific_claim_found?: string | null
    url?: string | null
  }[]
}
export interface MeetingScheduleInput {
  /**
   * Opaque gp-api ElectedOffice.id; passed through to the callback. Not used during research.
   */
  elected_office_id?: string
  /**
   * Full position/office name as it appears to the candidate (e.g. 'Burnsville City Council Member', 'Mayor of Cheyenne'). Usually contains the jurisdiction verbatim; when generic (e.g. just 'City Council'), the agent must infer the city from the position + state via WebSearch.
   */
  office: string
  /**
   * Two-letter state code (e.g. MN).
   */
  state: string
}
export interface MeetingScheduleFound {
  /**
   * Typical meeting length in minutes.
   */
  duration_minutes: number
  generated_at: string
  /**
   * One-sentence English description of the recurrence; must match the RRULE semantically.
   */
  human: string
  /**
   * Customary location for regular meetings (e.g. 'City Hall Council Chambers, 200 Main St'). Falls back to a city-hall address if the source doesn't state a specific room.
   */
  location: string
  /**
   * Official name of the meeting body as the source refers to it (e.g. 'City Council', 'Planning Board'). Used as the list-row title in the candidate dashboard.
   */
  meeting_name: string
  /**
   * iCalendar RFC 5545 RRULE string. MUST NOT contain DTSTART.
   */
  rrule: string
  /**
   * @minItems 1
   * @maxItems 20
   */
  sources:
    | [
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
  status: 'found'
  /**
   * 24-hour HH:MM in local time.
   */
  time: string
  /**
   * IANA timezone name (e.g. America/Denver).
   */
  timezone: string
}
export interface MeetingScheduleNotFound {
  duration_minutes: number
  generated_at: string
  human: string
  location: string
  meeting_name: string
  rrule: string
  /**
   * @maxItems 20
   */
  sources:
    | []
    | [
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
    | [
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
        {
          note: string
          url: string
        },
      ]
  status: 'not_found'
  time: string
  timezone: string
}
