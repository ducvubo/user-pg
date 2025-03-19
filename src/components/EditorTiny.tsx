'use client'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface Props {
  width?: string // Thêm thuộc tính width
  height?: string // Thêm thuộc tính height,
  editorRef: any
  className?: string
}
export default function EditorTiny({ width = '100%', height = '400px', editorRef, className }: Props) {
  const { theme } = useTheme()

  return (
    <div style={{ width }} className={cn(className)}>
      <Editor
        key={theme}
        apiKey={`${process.env.NEXT_PUBLIC_API_KEY_TINY_CME}`}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          branding: false,
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          plugins: [
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'image',
            'link',
            'lists',
            'media',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'checklist',
            'mediaembed',
            'casechange',
            'export',
            'formatpainter',
            'pageembed',
            'a11ychecker',
            // 'tinymcespellchecker',
            'permanentpen',
            'powerpaste',
            'advtable',
            'advcode',
            'editimage',
            'advtemplate',
            // 'ai',
            'mentions',
            'tinycomments',
            'tableofcontents',
            'footnotes',
            'mergetags',
            'autocorrect',
            'typography',
            'inlinecss',
            'markdown',
            'preview'
          ],
          toolbar:
            'undo redo |  | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' }
          ],
          theme_advanced_buttons1:
            'save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect',
          theme_advanced_buttons2:
            'cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor',
          theme_advanced_buttons3:
            'tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen',
          table_default_attributes: {
            border: '1px solid #ccc',
            'border-collapse': 'collapse'
          },
          resize: 'both',
          height: height,
          width: '100%'
        }}
        initialValue={editorRef.current ? editorRef.current : ''}
      />
    </div>
  )
}
