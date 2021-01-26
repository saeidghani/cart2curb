import React, {useState, Fragment} from 'react';
import {Button, message, Upload, Form, Input, Row, Col} from 'antd';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import Link from 'next/link';

import VideoPlayer from '../../UI/VideoPlayer';

const {Item} = Form;

import routes from "../../../constants/routes";

const Video = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile.addCategory);
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const [leftVideoUrl, setLeftVideoUrl] = useState('');
    const [rightVideoUrl, setRightVideoUrl] = useState('');

    const submitHandler = async () => {

        const leftVideoBody = {
            url: leftVideoUrl,
            arrangementNum: 1
        };
        const rightVideoBody = {
            url: leftVideoUrl,
            arrangementNum: 1
        };

        const res1 = await dispatch.adminProfile.addVideo({body: leftVideoBody, token});
        const res2 = await dispatch.adminProfile.addVideo({body: rightVideoBody, token});
        if (res1 && res2) {
            router.push({pathname: routes.admin.profile.index, query: {tab: 'video'}});
        }
    };

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (isJpgOrPng) {
            message.error('You can not upload image!');
        }
        /*const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }*/
        return !isJpgOrPng;
    }

    const handleLeftVideoUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setLeftVideoUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const handleRightVideoUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setRightVideoUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const UploadVideo = ({videoUrl, onUpload}) => (<Upload
        name="photo"
        listType="picture-card"
        className="avatar-uploader-wrapper border-0"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onUpload}
        {...uploadProps}
    >
        <Fragment>
            {videoUrl ? <VideoPlayer src={videoUrl}/> :
                <div
                    className={'full-rounded text-overline bg-card flex items-center justify-center'}
                    style={{width: 580, height: 340}}
                >
                </div>}
        </Fragment>
    </Upload>);

    return (
        <div className="py-5 flex flex-col" style={{position: 'relative', top: 110, height: 460}}>
            <div className="flex flex-col">
                <div className="mb-6 font-bold" style={{position: 'relative', top: '-125px'}}>Upload Your Videos</div>
                <div className="flex space-x-2 mt-3">
                    <UploadVideo videoUrl={leftVideoUrl} onUpload={handleLeftVideoUpload}/>
                    <UploadVideo videoUrl={rightVideoUrl} onUpload={handleRightVideoUpload}/>
                </div>
            </div>
            <div className="flex justify-end space-x-2" style={{position: 'relative', top: 150}}>
                <Item>
                    <Button
                        type="primary"
                        block
                        className='w-full md:w-32 ml-0 md:ml-5'
                        htmlType='submit'
                        loading={loading}
                        onClick={submitHandler}
                    >
                        Save
                    </Button>
                </Item>
                <Item>
                    <Link
                        href={{pathname: routes.admin.profile.index, query: {tab: 'video'}}}
                    >
                        <Button danger className='w-full md:w-32'>Cancel</Button>
                    </Link>
                </Item>
            </div>
        </div>
    )
};

export default Video;